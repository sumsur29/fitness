import React, { useState, useEffect, useMemo } from 'react';
import { Check, Flame, Dumbbell, Utensils, Home, Circle } from 'lucide-react';

// ───────────────────────────────────────────────────────────────
// DATA — straight from the posters
// ───────────────────────────────────────────────────────────────

const MEALS = [
  {
    id: 1, slot: 'Meal 1', time: 'Morning',
    items: ['Overnight chia seeds (2 tbsp)', '1 Orange / Half Apple', '1/4 Avocado', '1 tbsp Pumpkin/Sunflower/Flax mix OR 4 Walnuts'],
    p: 8, c: 30, f: 18, cal: 280,
  },
  {
    id: 2, slot: 'Pre-Workout', time: '45–60 min before gym', optional: true,
    items: ['1 Banana', 'OR', '2 Dates'],
    p: 1, c: 25, f: 0, cal: 100,
  },
  {
    id: 3, slot: 'Post-Workout', time: 'Within 45 min after gym',
    items: ['1 Scoop Protein (21g)', '200ml Protein Milk', 'Almonds (8–10)', 'Munakka (8–10)', 'Seeds (1 tsp)', '+ ADD ONE: 1 Banana OR 2 Dates OR Small Oats (30g)'],
    p: 30, c: 35, f: 10, cal: 350,
  },
  {
    id: 4, slot: 'Lunch', time: '12:30 – 2:00 PM',
    items: ['Quinoa / Oats / Lentil Pasta (Big Portion)', '150g Paneer or Tofu', 'Lots of Vegetables', '1 tsp Olive Oil / Ghee'],
    p: 35, c: 60, f: 15, cal: 550,
  },
  {
    id: 5, slot: 'Snacks', time: '4:30 – 5:30 PM',
    items: ['Rotate & Alternate', 'Chickpeas / Edamame / Sprouts / Tofu Cubes / Roasted Chana (150g)'],
    p: 12, c: 25, f: 5, cal: 200,
  },
  {
    id: 6, slot: 'Protein Milk', time: '7:00 – 8:00 PM',
    items: ['Protein Milk (as per convenience)', 'TIP: If digestion feels heavy, use Soy Milk + Protein Scoop OR Isolate Protein'],
    p: 25, c: 15, f: 6, cal: 220,
  },
  {
    id: 7, slot: 'Dinner', time: '8:30 – 9:30 PM',
    items: ['Roti (Wheat + Sattu + Greek Yogurt Batter)', 'Dal (1 Bowl)', 'Vegetables / Salad', '+ ADD ONE (Heavy days): Extra Dal / Paneer / Tofu Side'],
    p: 30, c: 40, f: 12, cal: 450,
  },
];

const MACRO_TARGETS = { p: '145–155g', c: '230–260g', f: '50–60g', cal: '~2,150 (Training)' };

const WORKOUTS = [
  { day: 'Mon', focus: 'Push', sub: 'Chest, Shoulders, Triceps', kind: 'Strength', accent: 'red',
    exercises: [
      { name: 'Barbell Bench Press', sets: '4 × 5–8' },
      { name: 'Incline Dumbbell Press', sets: '4 × 6–10' },
      { name: 'Overhead Press', sets: '4 × 6–10' },
      { name: 'Dips (Weighted)', sets: '3 × 12–15' },
      { name: 'Triceps Pushdown', sets: '3 × 10–12' },
      { name: 'Skull Crushers', sets: '3 × 10–12' },
      { name: 'Rear Delt Fly', sets: '3 × 12–15' },
    ]
  },
  { day: 'Tue', focus: 'Pull', sub: 'Back, Biceps', kind: 'Strength', accent: 'red',
    exercises: [
      { name: 'Pull-Ups / Lat Pulldown', sets: '4 × 6–10' },
      { name: 'Barbell Row', sets: '4 × 6–10' },
      { name: 'Seated Cable Row', sets: '3 × 8–12' },
      { name: 'Face Pulls', sets: '3 × 12–15' },
      { name: 'Barbell Curl', sets: '3 × 8–12' },
      { name: 'Hammer Curl', sets: '3 × 10–12' },
      { name: 'Rear Delt Fly', sets: '3 × 12–15' },
    ]
  },
  { day: 'Wed', focus: 'Legs', sub: 'Quads, Hamstrings, Glutes, Calves', kind: 'Strength', accent: 'red',
    exercises: [
      { name: 'Barbell Squat', sets: '4 × 5–8' },
      { name: 'Romanian Deadlift', sets: '4 × 6–10' },
      { name: 'Leg Press', sets: '3 × 10–12' },
      { name: 'Leg Curl', sets: '3 × 10–12' },
      { name: 'Leg Extension', sets: '3 × 12–15' },
      { name: 'Standing Calf Raise', sets: '4 × 12–15' },
      { name: 'Abs: Hanging Leg Raise', sets: '3 × 12–15' },
    ]
  },
  { day: 'Thu', focus: 'Push', sub: 'Hypertrophy Focus', kind: 'Hypertrophy', accent: 'amber',
    exercises: [
      { name: 'Incline Bench Press', sets: '4 × 8–12' },
      { name: 'Dumbbell Shoulder Press', sets: '4 × 8–12' },
      { name: 'Machine Chest Press', sets: '3 × 10–12' },
      { name: 'Lateral Raises', sets: '3 × 12–15' },
      { name: 'Cable Fly', sets: '3 × 12–15' },
      { name: 'Triceps Rope Pushdown', sets: '4 × 12–15' },
      { name: 'Dips (Assisted)', sets: '3 × 8–12' },
    ]
  },
  { day: 'Fri', focus: 'Pull', sub: 'Hypertrophy Focus', kind: 'Hypertrophy', accent: 'amber',
    exercises: [
      { name: 'Lat Pulldown', sets: '4 × 8–12' },
      { name: 'Single Arm Row', sets: '4 × 8–12' },
      { name: 'Chest Supported Row', sets: '3 × 10–12' },
      { name: 'Rear Delt Fly', sets: '3 × 12–15' },
      { name: 'EZ Bar Curl', sets: '3 × 10–12' },
      { name: 'Preacher Curl', sets: '3 × 10–12' },
    ]
  },
  { day: 'Sat', focus: 'Legs', sub: 'Strength & Glutes Focus', kind: 'Glutes', accent: 'violet',
    exercises: [
      { name: 'Hip Thrust', sets: '4 × 8–12' },
      { name: 'Bulgarian Split Squat', sets: '3 × 10–12 (each leg)' },
      { name: 'Leg Press (Feet High)', sets: '3 × 10–12' },
      { name: 'RDL', sets: '3 × 10–12' },
      { name: 'Seated Leg Curl', sets: '3 × 12–15' },
      { name: 'Cable Kickbacks', sets: '3 × 12–15' },
      { name: 'Calf Raise', sets: '4 × 15–20' },
    ]
  },
  { day: 'Sun', focus: 'Rest', sub: 'Active Recovery', kind: 'Recovery', accent: 'sky',
    exercises: [
      { name: '8k–12k Steps', sets: '' },
      { name: 'Mobility / Stretching', sets: '' },
      { name: 'Foam Rolling', sets: '' },
      { name: 'Light Walk / Outdoor Activity', sets: '' },
    ]
  },
];

// ───────────────────────────────────────────────────────────────
// STORAGE
// ───────────────────────────────────────────────────────────────

const STORAGE_KEY = 'plan-app-v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { followed: {} };
  } catch { return { followed: {} }; }
}

function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function dayOfWeek() {
  // Mon=0 .. Sun=6 (to match WORKOUTS order)
  const d = new Date().getDay(); // Sun=0..Sat=6
  return (d + 6) % 7;
}

function computeStreaks(followed) {
  const keys = Object.keys(followed).filter(k => followed[k]).sort();
  if (keys.length === 0) return { current: 0, longest: 0, total: 0 };

  const today = new Date(); today.setHours(0,0,0,0);
  let current = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (followed[k]) current++;
    else if (i === 0) continue;
    else break;
  }

  let longest = 0, run = 0, prev = null;
  for (const k of keys) {
    const d = new Date(k);
    if (prev) {
      const diff = (d - prev) / 86400000;
      if (diff === 1) run++;
      else run = 1;
    } else run = 1;
    longest = Math.max(longest, run);
    prev = d;
  }

  return { current, longest, total: keys.length };
}

// ───────────────────────────────────────────────────────────────
// COMPONENTS
// ───────────────────────────────────────────────────────────────

const accentClasses = {
  red:    { bg: 'bg-rose-500/10', text: 'text-rose-300', dot: 'bg-rose-400', ring: 'ring-rose-500/30' },
  amber:  { bg: 'bg-amber-500/10', text: 'text-amber-300', dot: 'bg-amber-400', ring: 'ring-amber-500/30' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-300', dot: 'bg-violet-400', ring: 'ring-violet-500/30' },
  sky:    { bg: 'bg-sky-500/10', text: 'text-sky-300', dot: 'bg-sky-400', ring: 'ring-sky-500/30' },
};

function MealCard({ meal, compact }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl text-emerald-50">{meal.slot}</h3>
            {meal.optional && <span className="text-[10px] uppercase tracking-widest text-emerald-400/60 border border-emerald-400/30 rounded-full px-2 py-0.5">optional</span>}
          </div>
          <p className="text-xs text-emerald-100/40 mt-0.5 tracking-wide">{meal.time}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-serif text-2xl text-emerald-300 leading-none">~{meal.cal}</div>
          <div className="text-[10px] uppercase tracking-widest text-emerald-100/40 mt-1">kcal</div>
        </div>
      </div>

      {!compact && (
        <ul className="space-y-1.5 mb-4">
          {meal.items.map((it, i) => (
            <li key={i} className="text-sm text-emerald-50/75 leading-relaxed flex gap-2">
              <span className="text-emerald-400/40 select-none">·</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-4 pt-3 border-t border-white/5">
        <Macro label="P" value={meal.p} color="text-emerald-300" />
        <Macro label="C" value={meal.c} color="text-amber-200/80" />
        <Macro label="F" value={meal.f} color="text-rose-200/80" />
      </div>
    </div>
  );
}

function Macro({ label, value, color }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className={`text-[10px] uppercase tracking-widest ${color} opacity-70`}>{label}</span>
      <span className={`font-serif text-base ${color}`}>{value}g</span>
    </div>
  );
}

function WorkoutCard({ workout, isToday }) {
  const a = accentClasses[workout.accent];
  return (
    <div className={`rounded-2xl border border-white/8 bg-white/[0.02] p-5 ${isToday ? `ring-1 ${a.ring}` : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${a.dot}`} />
            <span className={`text-[10px] uppercase tracking-[0.2em] ${a.text}`}>{workout.kind}</span>
          </div>
          <h3 className="font-serif text-2xl text-sky-50 mt-1">{workout.focus}</h3>
          <p className="text-xs text-sky-100/40 mt-0.5">{workout.sub}</p>
        </div>
        <div className={`text-sm font-serif ${a.text} tabular-nums`}>{workout.day}</div>
      </div>

      <ol className="space-y-2">
        {workout.exercises.map((ex, i) => (
          <li key={i} className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-sky-50/85">
              <span className="text-sky-100/30 tabular-nums mr-2">{String(i+1).padStart(2,'0')}</span>
              {ex.name}
            </span>
            {ex.sets && <span className="text-sky-100/50 tabular-nums text-xs shrink-0">{ex.sets}</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// SCREENS
// ───────────────────────────────────────────────────────────────

function TodayScreen({ state, setState }) {
  const dow = dayOfWeek();
  const workout = WORKOUTS[dow];
  const tk = todayKey();
  const isFollowed = !!state.followed[tk];

  function toggleFollowed() {
    const next = { ...state, followed: { ...state.followed, [tk]: !isFollowed } };
    if (!next.followed[tk]) delete next.followed[tk];
    setState(next);
  }

  const streaks = useMemo(() => computeStreaks(state.followed), [state.followed]);
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6 pb-32">
      <header className="pt-2">
        <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">{dateStr}</p>
        <h1 className="font-serif text-4xl text-white mt-1 leading-tight">Today</h1>
        <div className="flex items-center gap-4 mt-3 text-sm">
          <div className="flex items-center gap-1.5 text-orange-300">
            <Flame size={14} />
            <span className="tabular-nums">{streaks.current}</span>
            <span className="text-white/40 text-xs">day streak</span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <div className="text-white/50 text-xs">
            <span className="tabular-nums text-white/70">{streaks.total}</span> total
          </div>
        </div>
      </header>

      <section>
        <SectionLabel icon={<Dumbbell size={11} />} text="Training" />
        <WorkoutCard workout={workout} isToday />
      </section>

      <section>
        <SectionLabel icon={<Utensils size={11} />} text="Meals" />
        <div className="space-y-3">
          {MEALS.map(m => <MealCard key={m.id} meal={m} compact />)}
        </div>
      </section>

      <div className="fixed bottom-20 left-0 right-0 px-4 pointer-events-none z-20">
        <div className="max-w-md mx-auto pointer-events-auto">
          <button
            onClick={toggleFollowed}
            className={`w-full rounded-2xl py-4 px-5 flex items-center justify-between transition-all border ${
              isFollowed
                ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-100 shadow-lg shadow-emerald-500/10'
                : 'bg-white/5 border-white/10 text-white/80 backdrop-blur-xl'
            }`}
          >
            <span className="font-serif text-lg">
              {isFollowed ? 'Followed today' : 'Mark today as followed'}
            </span>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isFollowed ? 'bg-emerald-400 text-emerald-950' : 'bg-white/10 text-white/40'
            }`}>
              {isFollowed ? <Check size={18} strokeWidth={3} /> : <Circle size={16} />}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ icon, text }) {
  return (
    <div className="flex items-center gap-2 mb-3 text-white/40">
      {icon}
      <span className="text-[10px] uppercase tracking-[0.25em]">{text}</span>
      <div className="flex-1 h-px bg-white/5 ml-1" />
    </div>
  );
}

function MealsScreen() {
  return (
    <div className="space-y-6 pb-24">
      <header className="pt-2">
        <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-400/70">Diet Plan</p>
        <h1 className="font-serif text-4xl text-white mt-1 leading-tight">Eat</h1>
        <p className="text-sm text-white/50 mt-2">&lt;15% body fat, build lean muscle. 300–400 kcal deficit on training days.</p>
      </header>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-300/80 mb-2">Daily Macro Targets</p>
        <div className="grid grid-cols-4 gap-3">
          <TargetBlock label="Protein" value={MACRO_TARGETS.p} />
          <TargetBlock label="Carbs" value={MACRO_TARGETS.c} />
          <TargetBlock label="Fats" value={MACRO_TARGETS.f} />
          <TargetBlock label="kcal" value={MACRO_TARGETS.cal} small />
        </div>
      </div>

      <div className="space-y-3">
        {MEALS.map(m => <MealCard key={m.id} meal={m} />)}
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3">Rest Day Adjustments</p>
        <ul className="space-y-1.5 text-sm text-white/70">
          <li>· Keep protein the same (145–155g)</li>
          <li>· Reduce carbs by 30–50g</li>
          <li>· Increase veggies & healthy fats slightly</li>
          <li>· ~300–400 kcal less than training days</li>
        </ul>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-5 mb-3">Daily</p>
        <ul className="space-y-1.5 text-sm text-white/70">
          <li>· 3–4 L water</li>
          <li>· 8k–12k steps</li>
          <li>· 7–8 hours sleep, 90% of the time</li>
        </ul>
      </div>
    </div>
  );
}

function TargetBlock({ label, value, small }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-widest text-emerald-300/60">{label}</div>
      <div className={`font-serif text-emerald-100 mt-0.5 ${small ? 'text-xs' : 'text-sm'}`}>{value}</div>
    </div>
  );
}

function WorkoutsScreen() {
  const dow = dayOfWeek();
  const [selected, setSelected] = useState(dow);

  return (
    <div className="space-y-6 pb-24">
      <header className="pt-2">
        <p className="text-[11px] uppercase tracking-[0.25em] text-sky-400/70">Workout Plan</p>
        <h1 className="font-serif text-4xl text-white mt-1 leading-tight">Train</h1>
        <p className="text-sm text-white/50 mt-2">Push / Pull / Legs split. Strength + hypertrophy. 60–120s between sets.</p>
      </header>

      <div className="flex gap-1.5 overflow-x-auto -mx-4 px-4 pb-1 scrollbar-hide">
        {WORKOUTS.map((w, i) => {
          const a = accentClasses[w.accent];
          const isSelected = i === selected;
          const isToday = i === dow;
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`shrink-0 rounded-xl px-3 py-2 border transition-all text-left ${
                isSelected
                  ? 'bg-white/8 border-white/20'
                  : 'bg-white/[0.02] border-white/5'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`w-1 h-1 rounded-full ${a.dot}`} />
                <span className={`text-[10px] uppercase tracking-widest ${isToday ? 'text-white' : 'text-white/50'}`}>
                  {w.day}{isToday && ' ·'}
                </span>
              </div>
              <div className={`font-serif text-sm mt-0.5 ${isSelected ? 'text-white' : 'text-white/60'}`}>
                {w.focus}
              </div>
            </button>
          );
        })}
      </div>

      <WorkoutCard workout={WORKOUTS[selected]} isToday={selected === dow} />

      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3">Cardio</p>
        <ul className="space-y-1.5 text-sm text-white/70">
          <li>· 2–3 sessions / week</li>
          <li>· 20–30 min moderate (incline walk / cycling / HIIT)</li>
          <li>· Keep moderate — don't overdo it</li>
        </ul>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-5 mb-3">Focus Areas</p>
        <p className="text-sm text-white/70">Upper chest · Shoulders · Back width · Arms · Glutes / Hamstrings</p>
      </div>
    </div>
  );
}

function StreakScreen({ state }) {
  const streaks = useMemo(() => computeStreaks(state.followed), [state.followed]);

  const today = new Date(); today.setHours(0,0,0,0);
  const cells = [];
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    cells.push({ key: k, date: d, done: !!state.followed[k], isToday: i === 0 });
  }

  return (
    <div className="space-y-6 pb-24">
      <header className="pt-2">
        <p className="text-[11px] uppercase tracking-[0.25em] text-orange-400/70">Consistency</p>
        <h1 className="font-serif text-4xl text-white mt-1 leading-tight">Streak</h1>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <StatBlock label="Current" value={streaks.current} accent="text-orange-300" />
        <StatBlock label="Longest" value={streaks.longest} accent="text-amber-300" />
        <StatBlock label="Total" value={streaks.total} accent="text-emerald-300" />
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
        <div className="flex items-baseline justify-between mb-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Last 12 Weeks</p>
          <p className="text-[10px] text-white/30">{cells.filter(c => c.done).length} / 84 days</p>
        </div>
        <div className="grid grid-cols-12 gap-1.5">
          {cells.map((c) => (
            <div
              key={c.key}
              title={`${c.date.toLocaleDateString()}${c.done ? ' · followed' : ''}`}
              className={`aspect-square rounded-[3px] ${
                c.done
                  ? 'bg-emerald-400/80'
                  : c.isToday
                    ? 'bg-white/10 ring-1 ring-white/30'
                    : 'bg-white/[0.04]'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 text-[10px] text-white/30">
          <span>12 weeks ago</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-[2px] bg-white/[0.04]" />
            <div className="w-2 h-2 rounded-[2px] bg-emerald-400/30" />
            <div className="w-2 h-2 rounded-[2px] bg-emerald-400/60" />
            <div className="w-2 h-2 rounded-[2px] bg-emerald-400/80" />
          </div>
          <span>Today</span>
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
        <p className="font-serif text-white/90 italic text-lg leading-relaxed">
          "Consistency + patience + smart work = transformation."
        </p>
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 mt-3">— the poster</p>
      </div>
    </div>
  );
}

function StatBlock({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 text-center">
      <div className={`font-serif text-4xl tabular-nums ${accent}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1">{label}</div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// SHELL
// ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'today', label: 'Today', icon: Home },
  { id: 'eat', label: 'Eat', icon: Utensils },
  { id: 'train', label: 'Train', icon: Dumbbell },
  { id: 'streak', label: 'Streak', icon: Flame },
];

export default function App() {
  const [state, setState] = useState(() => loadState());
  const [tab, setTab] = useState('today');

  useEffect(() => { saveState(state); }, [state]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-sky-500/[0.03] blur-[100px]" />
      </div>

      <div className="relative max-w-md mx-auto px-4 pt-6">
        {tab === 'today' && <TodayScreen state={state} setState={setState} />}
        {tab === 'eat' && <MealsScreen />}
        {tab === 'train' && <WorkoutsScreen />}
        {tab === 'streak' && <StreakScreen state={state} />}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/5 bg-[#0a0a0c]/85 backdrop-blur-xl">
        <div className="max-w-md mx-auto grid grid-cols-4 px-2 pt-2 pb-5">
          {TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
                  active ? 'text-white' : 'text-white/40'
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.2 : 1.6} />
                <span className={`text-[10px] tracking-wide ${active ? 'font-medium' : ''}`}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
