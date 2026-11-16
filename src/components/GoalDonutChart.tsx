import React from 'react';
import { Target, Plus, Minus } from 'lucide-react';
import {
  GoalsSummary,
  StudyTimeGoalSummary,
  formatDurationFa,
} from '../utils/analyticsEngine';

interface GoalDonutChartProps {
  goals: GoalsSummary;
  timeGoal: StudyTimeGoalSummary;
  periodLabel: string;
  dailyGoalMinutes: number;
  onChangeDailyGoalMinutes: (minutes: number) => void;
}

export const GoalDonutChart: React.FC<GoalDonutChartProps> = ({
  goals,
  timeGoal,
  periodLabel,
  dailyGoalMinutes,
  onChangeDailyGoalMinutes,
}) => {
  const { completed, remaining, total, percent: goalsPercent } = goals;
  const clampedTimePercent = Math.min(100, Math.max(0, timeGoal.percent));
  const clampedGoalsPercent = Math.min(100, Math.max(0, goalsPercent));

  // Concentric SVG Donut Dimensions (Outer = Study Time, Inner = Task Goals)
  const size = 168;
  const center = size / 2;

  const outerRadius = 71;
  const outerStroke = 10;
  const outerCircumference = 2 * Math.PI * outerRadius;
  const outerDashOffset = outerCircumference - (clampedTimePercent / 100) * outerCircumference;

  const innerRadius = 54;
  const innerStroke = 8;
  const innerCircumference = 2 * Math.PI * innerRadius;
  const innerDashOffset = innerCircumference - (clampedGoalsPercent / 100) * innerCircumference;

  const stepMinutes = 30;
  const canDecrease = dailyGoalMinutes > 30;
  const canIncrease = dailyGoalMinutes < 720;

  return (
    <section
      aria-label={`نمودار تحقق اهداف و زمان مطالعه ${periodLabel}`}
      className="bg-white rounded-3xl shadow-[0_14px_34px_-4px_rgba(0,0,0,0.13),0_4px_12px_-2px_rgba(0,0,0,0.08)] p-5 sm:p-6 flex flex-col justify-between h-full"
    >
      {/* Card Header + Daily Time Goal Adjuster */}
      <div className="flex items-center justify-between gap-2 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-neutral-900 whitespace-nowrap truncate">
              تحقق زمان و اهداف {periodLabel}
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5 whitespace-nowrap truncate">
              {timeGoal.targetLabel}
            </p>
          </div>
        </div>

        {/* Compact Daily Study Goal Stepper */}
        <div
          className="flex items-center gap-1 bg-neutral-100/80 rounded-xl p-1 shrink-0"
          title="تنظیم هدف مطالعه روزانه"
        >
          <button
            type="button"
            disabled={!canDecrease}
            onClick={() => onChangeDailyGoalMinutes(Math.max(30, dailyGoalMinutes - stepMinutes))}
            className="w-6 h-6 rounded-lg bg-white text-neutral-700 hover:text-neutral-900 disabled:opacity-40 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20"
            aria-label="کاهش هدف روزانه به میزان 30 دقیقه"
            title="کاهش 30 دقیقه"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-[11px] font-bold text-neutral-800 px-1.5 tabular-nums whitespace-nowrap">
            {formatDurationFa(dailyGoalMinutes)}
          </span>
          <button
            type="button"
            disabled={!canIncrease}
            onClick={() => onChangeDailyGoalMinutes(Math.min(720, dailyGoalMinutes + stepMinutes))}
            className="w-6 h-6 rounded-lg bg-white text-neutral-700 hover:text-neutral-900 disabled:opacity-40 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20"
            aria-label="افزایش هدف روزانه به میزان 30 دقیقه"
            title="افزایش 30 دقیقه"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Donut Chart & Full-Width Single-Line Breakdown */}
      <div className="flex-1 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-5 pt-5">
        {/* Dual-Ring SVG Donut */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="-rotate-90"
            role="img"
            aria-label={`تحقق زمان مطالعه ${timeGoal.percent}% و اهداف ${goalsPercent}%`}
          >
            {/* Outer Track: Study Time */}
            <circle
              cx={center}
              cy={center}
              r={outerRadius}
              fill="none"
              stroke="#e5e5e5"
              strokeWidth={outerStroke}
            />
            {clampedTimePercent > 0 && (
              <circle
                cx={center}
                cy={center}
                r={outerRadius}
                fill="none"
                stroke="#171717"
                strokeWidth={outerStroke}
                strokeLinecap="round"
                strokeDasharray={outerCircumference}
                strokeDashoffset={outerDashOffset}
                className="transition-[stroke-dashoffset,stroke] duration-500 ease-out"
              />
            )}

            {/* Inner Track: Task Goals */}
            <circle
              cx={center}
              cy={center}
              r={innerRadius}
              fill="none"
              stroke="#e5e5e5"
              strokeWidth={innerStroke}
            />
            {total > 0 && clampedGoalsPercent > 0 && (
              <circle
                cx={center}
                cy={center}
                r={innerRadius}
                fill="none"
                stroke="#2563eb"
                strokeWidth={innerStroke}
                strokeLinecap="round"
                strokeDasharray={innerCircumference}
                strokeDashoffset={innerDashOffset}
                className="transition-[stroke-dashoffset,stroke] duration-500 ease-out"
              />
            )}
          </svg>

          {/* Center Summary Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
            <span
              dir="ltr"
              className="text-xl font-extrabold tabular-nums leading-none text-neutral-900"
            >
              {timeGoal.percent}%
            </span>
            <span className="text-[10px] font-medium text-neutral-500 mt-1 whitespace-nowrap">
              تایم مطالعه
            </span>
            <div className="w-8 h-px bg-neutral-200 my-1.5" />
            <span
              dir="ltr"
              className={`text-xs font-bold tabular-nums leading-none ${
                total === 0 ? 'text-neutral-400' : 'text-blue-600'
              }`}
            >
              {total > 0 ? `${goalsPercent}%` : '—'}
            </span>
            <span className="text-[10px] font-medium text-neutral-400 mt-0.5 whitespace-nowrap">
              {total > 0 ? 'تسک‌ها' : 'بدون تسک'}
            </span>
          </div>
        </div>

        {/* Single-Line Metrics Breakdown */}
        <div className="flex-1 w-full space-y-1.5 min-w-0">
          <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-neutral-100/80">
            <div className="flex items-center gap-2 text-xs text-neutral-700 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-neutral-900" />
              <span className="font-medium whitespace-nowrap">زمان مطالعه‌شده</span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-neutral-900 tabular-nums whitespace-nowrap shrink-0">
              {formatDurationFa(timeGoal.achievedMinutes)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-neutral-100/80">
            <div className="flex items-center gap-2 text-xs text-neutral-700 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-200 shrink-0" />
              <span className="font-medium whitespace-nowrap">باقیمانده تا هدف</span>
            </div>
            <span
              className={`text-xs sm:text-sm font-bold tabular-nums whitespace-nowrap shrink-0 ${
                timeGoal.remainingMinutes === 0 && timeGoal.achievedMinutes > 0
                  ? 'text-emerald-600'
                  : 'text-neutral-700'
              }`}
            >
              {timeGoal.remainingMinutes === 0 && timeGoal.achievedMinutes > 0
                ? 'تکمیل شد'
                : formatDurationFa(timeGoal.remainingMinutes)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-neutral-100/80">
            <div className="flex items-center gap-2 text-xs text-neutral-700 min-w-0">
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  total === 0 ? 'bg-neutral-200' : 'bg-blue-600'
                }`}
              />
              <span className="font-medium whitespace-nowrap">اهداف تکمیل‌شده</span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-neutral-900 tabular-nums whitespace-nowrap shrink-0">
              {total > 0 ? `${completed} از ${total} هدف` : 'ثبت نشده'}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-neutral-100/80">
            <div className="flex items-center gap-2 text-xs text-neutral-700 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-400/70 shrink-0" />
              <span className="font-medium whitespace-nowrap">اهداف باقیمانده</span>
            </div>
            <span className="text-xs font-bold text-neutral-700 tabular-nums whitespace-nowrap shrink-0">
              {total > 0 ? `${remaining} هدف · ${goalsPercent}%` : '0 هدف'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
