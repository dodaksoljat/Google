import { motion } from "motion/react";
import { WeeklyPlan } from "../types";
import { Dumbbell, Clock, Weight, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface WorkoutPlanDisplayProps {
  plan: WeeklyPlan;
}

export default function WorkoutPlanDisplay({ plan }: WorkoutPlanDisplayProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <h2 className="text-2xl font-bold text-zinc-900">{plan.title}</h2>
      </div>

      <div className="space-y-4">
        {plan.days.map((day, dayIdx) => (
          <motion.div
            key={dayIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dayIdx * 0.1 }}
            className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
          >
            <button
              onClick={() => setExpandedDay(expandedDay === dayIdx ? null : dayIdx)}
              className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-zinc-50"
            >
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">{day.day}</h3>
                <p className="text-sm font-medium text-emerald-600">{day.focus}</p>
              </div>
              {expandedDay === dayIdx ? (
                <ChevronUp className="h-5 w-5 text-zinc-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-zinc-400" />
              )}
            </button>

            {expandedDay === dayIdx && (
              <div className="border-t border-zinc-100 p-5 space-y-6">
                {day.exercises.map((ex, exIdx) => (
                  <div key={exIdx} className="group relative">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-[10px] text-white">
                            {exIdx + 1}
                          </span>
                          {ex.name}
                        </h4>
                        
                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div className="flex items-center gap-2 rounded-lg bg-zinc-50 p-2 border border-zinc-100">
                            <Dumbbell className="h-4 w-4 text-zinc-500" />
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Séries/Reps</p>
                              <p className="text-xs font-semibold text-zinc-700">{ex.setsReps}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 rounded-lg bg-zinc-50 p-2 border border-zinc-100">
                            <Clock className="h-4 w-4 text-zinc-500" />
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Descanso</p>
                              <p className="text-xs font-semibold text-zinc-700">{ex.rest}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 rounded-lg bg-zinc-50 p-2 border border-zinc-100 col-span-2 sm:col-span-1">
                            <Weight className="h-4 w-4 text-zinc-500" />
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Carga</p>
                              <p className="text-xs font-semibold text-zinc-700">{ex.suggestedLoad}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row gap-4">
                          <div className="flex-1 flex gap-3 rounded-xl bg-emerald-50/50 p-4 border border-emerald-100/50">
                            <Info className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-bold text-emerald-800 uppercase tracking-tight mb-1">Execução</p>
                              <p className="text-sm text-emerald-900/80 leading-relaxed">{ex.execution}</p>
                            </div>
                          </div>
                          
                          <a 
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.videoSearchQuery)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 rounded-xl bg-red-50 p-4 border border-red-100 text-red-600 hover:bg-red-100 transition-colors shrink-0"
                          >
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase mb-1">Ver Vídeo</span>
                              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                              </svg>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                    {exIdx < day.exercises.length - 1 && (
                      <div className="mt-6 h-px w-full bg-zinc-100" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
