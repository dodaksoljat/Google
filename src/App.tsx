import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Dumbbell, 
  Target, 
  Calendar, 
  AlertCircle, 
  Sparkles, 
  Loader2,
  ChevronRight,
  User,
  Scale,
  Ruler,
  Apple,
  ClipboardList,
  CheckCircle2
} from "lucide-react";
import { Goal, Level, UserProfile, WeeklyPlan, NutritionPlan } from "./types";
import { generateWorkoutPlan, generateNutritionTips } from "./services/geminiService";
import WorkoutPlanDisplay from "./components/WorkoutPlanDisplay";
import NutritionDisplay from "./components/NutritionDisplay";

type Tab = "registration" | "workout" | "nutrition";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("registration");
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("trainer_profile");
    return saved ? JSON.parse(saved) : {
      name: "",
      age: 25,
      height: 175,
      weight: 70,
      goal: Goal.HYPERTROPHY,
      level: Level.BEGINNER,
      availability: "4 dias por semana, 60 min por sessão",
      restrictions: "Nenhuma",
    };
  });

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    localStorage.setItem("trainer_profile", JSON.stringify(profile));
  }, [profile]);

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    setRegistered(true);
    setActiveTab("workout");
  };

  const handleGenerateWorkout = async () => {
    setLoading(true);
    setError(null);
    try {
      const generatedPlan = await generateWorkoutPlan(profile);
      setPlan(generatedPlan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNutrition = async () => {
    setLoading(true);
    setError(null);
    try {
      const generatedNutrition = await generateNutritionTips(profile);
      setNutritionPlan(generatedNutrition);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const bmi = profile.weight / ((profile.height / 100) ** 2);
  const bmiCategory = bmi < 18.5 ? "Abaixo do peso" : bmi < 25 ? "Peso normal" : bmi < 30 ? "Sobrepeso" : "Obesidade";

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-lg shadow-zinc-200">
              <Dumbbell className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">AI Personal</h1>
          </div>
          
          <nav className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab("registration")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "registration" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
            >
              Cadastro
            </button>
            <button 
              onClick={() => setActiveTab("workout")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "workout" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
            >
              Treino
            </button>
            <button 
              onClick={() => setActiveTab("nutrition")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "nutrition" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
            >
              Nutrição
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {activeTab === "registration" && (
            <motion.div
              key="registration"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                <div className="mb-8 text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-white mb-4">
                    <ClipboardList className="h-8 w-8" />
                  </div>
                  <h2 className="text-3xl font-bold text-zinc-900">Cadastro do Aluno</h2>
                  <p className="mt-2 text-zinc-500">Defina seu perfil físico e objetivos para personalização total.</p>
                </div>

                <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-zinc-900/5"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
                      <Ruler className="h-3.5 w-3.5" /> Altura (cm)
                    </label>
                    <input
                      type="number"
                      required
                      value={profile.height}
                      onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) })}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
                      <Scale className="h-3.5 w-3.5" /> Peso (kg)
                    </label>
                    <input
                      type="number"
                      required
                      value={profile.weight}
                      onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) })}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium outline-none"
                    />
                  </div>

                  <div className="md:col-span-2 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase">Seu IMC Atual</p>
                      <p className="text-lg font-bold text-zinc-900">{bmi.toFixed(1)} - <span className="text-emerald-600">{bmiCategory}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-400 max-w-[150px]">O treino será ajustado para sua composição corporal.</p>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Objetivo Principal</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {Object.values(Goal).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setProfile({ ...profile, goal: g })}
                          className={`rounded-xl border p-4 text-sm font-bold transition-all ${
                            profile.goal === g ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="md:col-span-2 mt-4 w-full rounded-2xl bg-zinc-900 py-4 text-sm font-bold text-white shadow-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                  >
                    Salvar e Continuar <ChevronRight className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === "workout" && (
            <motion.div
              key="workout"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900">{profile.name || "Aluno"}</h3>
                      <p className="text-xs text-zinc-500">{profile.level} • {profile.goal}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Nível</label>
                      <div className="flex gap-2">
                        {Object.values(Level).map((l) => (
                          <button
                            key={l}
                            onClick={() => setProfile({ ...profile, level: l })}
                            className={`flex-1 py-2 text-[10px] font-bold rounded-lg border transition-all ${profile.level === l ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-500 border-zinc-200"}`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Restrições</label>
                      <textarea
                        value={profile.restrictions}
                        onChange={(e) => setProfile({ ...profile, restrictions: e.target.value })}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs font-medium outline-none resize-none"
                        rows={2}
                      />
                    </div>

                    <button
                      onClick={handleGenerateWorkout}
                      disabled={loading}
                      className="w-full rounded-xl bg-zinc-900 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-zinc-800 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-emerald-400" />}
                      {plan ? "Atualizar Treino" : "Gerar Meu Treino"}
                    </button>
                  </div>
                </div>

                {registered && (
                  <div className="rounded-3xl bg-emerald-900 p-6 text-white shadow-xl shadow-emerald-100">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Perfil Ativo</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed">
                      Seu treino será adaptado para sua altura de {profile.height}cm e peso de {profile.weight}kg.
                    </p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-8">
                {plan ? (
                  <WorkoutPlanDisplay plan={plan} />
                ) : (
                  <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white p-12 text-center">
                    <Dumbbell className="h-12 w-12 text-zinc-200 mb-4" />
                    <h3 className="text-lg font-bold text-zinc-900">Pronto para começar?</h3>
                    <p className="text-sm text-zinc-500 mt-2">Clique no botão ao lado para gerar seu plano de exercícios com vídeos.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "nutrition" && (
            <motion.div
              key="nutrition"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-4xl mx-auto"
            >
              {!nutritionPlan ? (
                <div className="rounded-3xl border border-zinc-200 bg-white p-12 text-center shadow-sm">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-6">
                    <Apple className="h-10 w-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900">Dicas de Alimentação</h2>
                  <p className="mt-2 text-zinc-500 max-w-md mx-auto">
                    Receba orientações nutricionais baseadas no seu peso ({profile.weight}kg) e objetivo de {profile.goal}.
                  </p>
                  <button
                    onClick={handleGenerateNutrition}
                    disabled={loading}
                    className="mt-8 px-8 py-4 rounded-2xl bg-zinc-900 text-white font-bold shadow-xl hover:bg-zinc-800 disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5 text-emerald-400" />}
                    Gerar Dicas Nutricionais
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <NutritionDisplay plan={nutritionPlan} />
                  <button 
                    onClick={() => setNutritionPlan(null)}
                    className="text-xs font-bold text-zinc-400 uppercase hover:text-zinc-600"
                  >
                    Refazer Plano Nutricional
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {error && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div className="rounded-2xl bg-red-600 p-4 text-white shadow-2xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
