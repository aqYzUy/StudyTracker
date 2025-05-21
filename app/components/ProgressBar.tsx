import { Goal } from "~/models/goal";

     interface Props {
       goals: Goal[];
     }

     export default function ProgressBar({ goals }: Props) {
       const progress =
         goals.length > 0
           ? (goals.reduce((sum, goal) => sum + goal.progress(), 0) / goals.length) *
             100
           : 0;

       const colorClass =
         progress >= 75
           ? "bg-green-500"
           : progress >= 25
           ? "bg-yellow-500"
           : "bg-red-500";

       return (
         <div className="mt-4">
           <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-6 overflow-hidden">
             <div
               className={`h-full ${colorClass} rounded-full transition-all duration-300`}
               style={{ width: `${progress}%` }}
             />
           </div>
           <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
             {progress.toFixed(0)}% Complete
           </p>
         </div>
       );
     }