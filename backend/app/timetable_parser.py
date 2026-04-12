"""
Timetable parsing utility for handling OCR (Tesseract) and Excel parsing
"""

import pytesseract
from PIL import Image
import cv2
import numpy as np
import pandas as pd
from datetime import datetime, time
import re
import os
from typing import Dict, List, Tuple

class TimetableParser:
    """Parse timetables from images (OCR) or Excel files"""
    
    DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    
    @staticmethod
    def validate_tesseract():
        """Check if Tesseract is installed"""
        try:
            pytesseract.pytesseract.get_tesseract_version()
            return True
        except Exception as e:
            print(f"Tesseract not found: {e}")
            return False
    
    @staticmethod
    def preprocess_image(image_path: str) -> np.ndarray:
        """Preprocess image for better OCR accuracy"""
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError(f"Could not read image: {image_path}")
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Apply thresholding
        _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
        
        # Denoise
        denoised = cv2.fastNlMeansDenoising(thresh, h=10)
        
        # Upscale for better OCR
        scale_percent = 200
        width = int(denoised.shape[1] * scale_percent / 100)
        height = int(denoised.shape[0] * scale_percent / 100)
        upscaled = cv2.resize(denoised, (width, height), interpolation=cv2.INTER_CUBIC)
        
        return upscaled
    
    @classmethod
    def extract_from_image(cls, image_path: str) -> Dict:
        """Extract timetable data from image using OCR"""
        if not cls.validate_tesseract():
            raise Exception("Tesseract OCR not installed. Install it using: sudo apt-get install tesseract-ocr")
        
        try:
            # Preprocess image
            processed_img = cls.preprocess_image(image_path)
            
            # Convert back to PIL for pytesseract
            pil_img = Image.fromarray(processed_img)
            
            # Extract text with configuration
            text = pytesseract.image_to_string(
                pil_img,
                config='--psm 6'  # Assume uniform block of text
            )
            
            # Parse the extracted text
            timetable_data = cls._parse_timetable_text(text)
            
            return {
                'status': 'success',
                'data': timetable_data,
                'raw_text': text
            }
        
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }
    
    @classmethod
    def extract_from_excel(cls, excel_path: str) -> Dict:
        """Extract timetable data from Excel file"""
        try:
            # Read Excel file
            xls = pd.ExcelFile(excel_path)
            sheet_names = xls.sheet_names
            
            timetable_data = {
                'sessions': [],
                'metadata': {
                    'sheets': sheet_names,
                    'total_sessions': 0
                }
            }
            
            # Parse each sheet
            for sheet_name in sheet_names:
                df = pd.read_excel(excel_path, sheet_name=sheet_name)
                sessions = cls._parse_excel_dataframe(df, sheet_name)
                timetable_data['sessions'].extend(sessions)
            
            timetable_data['metadata']['total_sessions'] = len(timetable_data['sessions'])
            
            return {
                'status': 'success',
                'data': timetable_data
            }
        
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }
    
    @staticmethod
    def _parse_timetable_text(text: str) -> Dict:
        """
        Parse raw OCR text into structured timetable data
        Expected format:
        Day | 09:00 | 11:00 | Subject | Room | Faculty | Class
        """
        lines = text.strip().split('\n')
        sessions = []
        
        for line in lines:
            line = line.strip()
            if not line or '|' not in line:
                continue
            
            parts = [p.strip() for p in line.split('|')]
            
            # Try to parse a session from the line
            try:
                if len(parts) >= 6:
                    day = parts[0].lower()
                    start_time_str = parts[1]
                    end_time_str = parts[2]
                    subject = parts[3]
                    room = parts[4]
                    faculty = parts[5] if len(parts) > 5 else None
                    class_name = parts[6] if len(parts) > 6 else None
                    
                    # Validate day
                    if day not in TimetableParser.DAYS_OF_WEEK:
                        continue
                    
                    # Parse times
                    try:
                        start_time = datetime.strptime(start_time_str, '%H:%M').time()
                        end_time = datetime.strptime(end_time_str, '%H:%M').time()
                    except ValueError:
                        continue
                    
                    session = {
                        'day': day,
                        'start_time': start_time.isoformat(),
                        'end_time': end_time.isoformat(),
                        'subject': subject,
                        'room': room,
                        'faculty_name': faculty,
                        'class_name': class_name
                    }
                    sessions.append(session)
            
            except Exception as e:
                print(f"Error parsing line: {line}, Error: {e}")
                continue
        
        return {
            'sessions': sessions,
            'total_sessions': len(sessions)
        }
    
    @staticmethod
    def _parse_excel_dataframe(df: pd.DataFrame, sheet_name: str) -> List[Dict]:
        """
        Parse Excel dataframe into sessions
        Expected columns: Day, Start Time, End Time, Subject, Room, Faculty, Class
        """
        sessions = []
        
        # Normalize column names
        df.columns = [col.lower().strip() for col in df.columns]
        
        # Expected column patterns
        expected_cols = {
            'day': ['day', 'day of week', 'weekday'],
            'start_time': ['start time', 'start_time', 'from', 'from time'],
            'end_time': ['end time', 'end_time', 'to', 'to time'],
            'subject': ['subject', 'course', 'course name'],
            'room': ['room', 'room no', 'room number', 'location'],
            'faculty': ['faculty', 'instructor', 'teacher', 'faculty name'],
            'class': ['class', 'batch', 'section', 'class name', 'semester']
        }
        
        # Find matching columns
        col_map = {}
        for expected_key, patterns in expected_cols.items():
            for col in df.columns:
                for pattern in patterns:
                    if pattern in col:
                        col_map[expected_key] = col
                        break
                if expected_key in col_map:
                    break
        
        # Parse rows
        for idx, row in df.iterrows():
            try:
                day = str(row[col_map.get('day', df.columns[0])]).lower().strip()
                
                if day not in TimetableParser.DAYS_OF_WEEK:
                    continue
                
                start_time_str = str(row[col_map.get('start_time', df.columns[1])])
                end_time_str = str(row[col_map.get('end_time', df.columns[2])])
                
                # Parse time (handle various formats)
                start_time = TimetableParser._parse_time(start_time_str)
                end_time = TimetableParser._parse_time(end_time_str)
                
                if not start_time or not end_time:
                    continue
                
                session = {
                    'day': day,
                    'start_time': start_time.isoformat(),
                    'end_time': end_time.isoformat(),
                    'subject': str(row[col_map.get('subject', df.columns[3])]).strip() if col_map.get('subject') else None,
                    'room': str(row[col_map.get('room', df.columns[4])]).strip() if col_map.get('room') else None,
                    'faculty_name': str(row[col_map.get('faculty', df.columns[5])]).strip() if col_map.get('faculty') else None,
                    'class_name': str(row[col_map.get('class', df.columns[6])]).strip() if col_map.get('class') else None,
                    'sheet_name': sheet_name
                }
                
                sessions.append(session)
            
            except Exception as e:
                print(f"Error parsing row {idx}: {e}")
                continue
        
        return sessions
    
    @staticmethod
    def _parse_time(time_str: str) -> time:
        """Parse time string in various formats"""
        time_str = str(time_str).strip()
        
        # Try common time formats
        formats = ['%H:%M', '%H:%M:%S', '%I:%M %p', '%I:%M:%S %p', '%H%M']
        
        for fmt in formats:
            try:
                return datetime.strptime(time_str, fmt).time()
            except ValueError:
                continue
        
        # Try regex pattern for HH:MM
        match = re.search(r'(\d{1,2}):?(\d{2})', time_str)
        if match:
            try:
                hour = int(match.group(1))
                minute = int(match.group(2))
                if 0 <= hour <= 23 and 0 <= minute <= 59:
                    return time(hour, minute)
            except:
                pass
        
        return None