import { motion } from "motion/react";
import { NutritionPlan } from "../types";
import { Apple, Droplets, Zap, Utensils } from "lucide-react";

interface NutritionDisplayProps {
  plan: NutritionPlan;
}

export default function NutritionDisplay({ plan }: NutritionDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <h2 className="text-2xl font-bold text-zinc-900">{plan.title}</h2>
      </div>

      {plan.dailyCalories && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-zinc-900 p-4 text-white">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Calorias Estimadas</p>
            <p className="text-xl font-bold">{plan.dailyCalories}</p>
          </div>
          {plan.macros && (
            <>
              <div className="rounded-2xl bg-emerald-500 p-4 text-white">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Proteínas</p>
                <p className="text-xl font-bold">{plan.macros.protein}</p>
              </div>
              <div className="rounded-2xl bg-amber-500 p-4 text-white">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Carboidratos</p>
                <p className="text-xl font-bold">{plan.macros.carbs}</p>
              </div>
              <div className="rounded-2xl bg-rose-500 p-4 text-white">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Gorduras</p>
                <p className="text-xl font-bold">{plan.macros.fats}</p>
              </div>
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {plan.recommendations.map((rec, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
                {rec.category.toLowerCase().includes("hidratação") ? <Droplets /> : 
                 rec.category.toLowerCase().includes("treino") ? <Zap /> : 
                 rec.category.toLowerCase().includes("refeição") ? <Utensils /> : <Apple />}
              </div>
              <h3 className="text-lg font-bold text-zinc-900">{rec.category}</h3>
            </div>
            <ul className="space-y-3">
              {rec.tips.map((tip, tipIdx) => (
                <li key={tipIdx} className="flex items-start gap-3 text-sm text-zinc-600">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
