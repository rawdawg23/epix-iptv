import { Check, X } from 'lucide-react';

interface ProsConsProps {
  pros: string[];
  cons: string[];
}

export default function ProsCons({ pros, cons }: ProsConsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 my-8">
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
        <h4 className="flex items-center gap-2 text-lg font-semibold text-green-700 dark:text-green-400 mb-4">
          <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
            <Check className="h-5 w-5" />
          </div>
          Pros
        </h4>
        <ul className="space-y-3">
          {pros.map((pro, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <span>{pro}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
        <h4 className="flex items-center gap-2 text-lg font-semibold text-red-700 dark:text-red-400 mb-4">
          <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center">
            <X className="h-5 w-5" />
          </div>
          Cons
        </h4>
        <ul className="space-y-3">
          {cons.map((con, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <X className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
              <span>{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
