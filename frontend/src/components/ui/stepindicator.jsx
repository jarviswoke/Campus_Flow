import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StepIndicator({ currentStep, steps }) {
  return (
    <div className="w-full py-4">
      <div className="flex items-start">
        {steps.map((step, index) => {
          const num = index + 1;
          const isCompleted = num < currentStep;
          const isCurrent = num === currentStep;

          return (
            <div key={index} className="flex items-start flex-1">
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  animate={{ scale: isCurrent ? 1.08 : 1 }}
                  transition={{ duration: 0.2 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-blue-600 border-blue-600'
                      : isCurrent
                      ? 'bg-white border-blue-600 shadow-md shadow-blue-100'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span className={`text-sm font-semibold ${isCurrent ? 'text-blue-600' : 'text-slate-400'}`}>
                      {num}
                    </span>
                  )}
                </motion.div>
                <div className="mt-2 text-center">
                  <p className={`text-xs font-semibold ${isCurrent ? 'text-blue-600' : 'text-slate-500'}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-slate-400">{step.description}</p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-slate-200 mx-3 mt-5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-blue-600"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
