import { Link } from 'react-router';
import { Heart, Clock, PlayCircle } from 'lucide-react';
import clsx from 'clsx';
import CourseCover from './CourseCover';
import Stars from '../ui/Stars';
import { Tag } from '../ui/Bits';
import { ProgressBar } from '../ui/Progress';
import { getInstructor } from '../../data/instructors';
import { formatHours, formatNumber, formatPrice } from '../../lib/format';
import { useLearning } from '../../hooks/useLearning';
import { useToast } from '../../hooks/useToast';

export const WishlistButton = ({ course, className }) => {
  const { inWishlist, toggleWishlist } = useLearning();
  const toast = useToast();
  const active = inWishlist(course.id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        const added = toggleWishlist(course.id);
        toast({ title: added ? 'Saved to wishlist' : 'Removed from wishlist', description: course.title, tone: 'info' });
      }}
      aria-pressed={active}
      aria-label={active ? `Remove ${course.title} from wishlist` : `Save ${course.title} to wishlist`}
      className={clsx(
        'grid size-10 place-items-center rounded-full backdrop-blur-md transition-all duration-300',
        active ? 'bg-lime text-coal' : 'bg-coal/45 text-cream hover:bg-coal/70',
        className
      )}
    >
      <Heart size={16} strokeWidth={2} fill={active ? 'currentColor' : 'none'} />
    </button>
  );
};

export const CourseCard = ({ course, className }) => {
  const instructor = getInstructor(course.instructor);
  const { isEnrolled, getProgress } = useLearning();
  const enrolled = isEnrolled(course.id);
  const progress = enrolled ? getProgress(course.id) : null;

  return (
    <article className={clsx('group relative flex flex-col', className)}>
      <div className="relative">
        <Link to={`/courses/${course.slug}`} data-cursor="View" aria-label={course.title} className="block">
          <CourseCover course={course} className="aspect-[4/3] rounded-2xl" />
        </Link>
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between">
          <div className="flex gap-1.5">
            {course.badge && <Tag tone={course.badge === 'Free' ? 'lime' : 'glass'}>{course.badge}</Tag>}
            {enrolled && <Tag tone="lime">Enrolled</Tag>}
          </div>
          <WishlistButton course={course} className="pointer-events-auto" />
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <p className="eyebrow text-ink-3">
          {instructor?.name} <span className="mx-1.5 text-line-strong">/</span> {course.level}
        </p>
        <h3 className="mt-2.5 font-display text-[1.45rem] leading-[1.1] tracking-[-0.025em]">
          <Link to={`/courses/${course.slug}`} className="link-sweep">
            {course.title}
          </Link>
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.8rem] text-ink-2">
          <span className="inline-flex items-center gap-1.5">
            <span className="font-medium text-ink">{course.rating}</span>
            <Stars rating={course.rating} size={12} />
            <span className="text-ink-3">({formatNumber(course.reviews)})</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} className="text-ink-3" />
            {formatHours(course.totalMinutes)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <PlayCircle size={13} className="text-ink-3" />
            {course.lessonCount} lessons
          </span>
        </div>

        <div className="mt-auto pt-5">
          {enrolled ? (
            <div>
              <div className="mb-2 flex items-center justify-between text-[0.8rem]">
                <Link to={`/learn/${course.slug}`} className="font-medium link-sweep">
                  {progress.percent === 100 ? 'Review course' : progress.count ? 'Continue learning' : 'Start learning'}
                </Link>
                <span className="font-mono text-ink-3">{progress.percent}%</span>
              </div>
              <ProgressBar value={progress.percent} />
            </div>
          ) : (
            <div className="flex items-baseline gap-2.5 border-t border-line pt-4">
              <span className="text-lg font-semibold tracking-[-0.02em]">{formatPrice(course.price)}</span>
              {course.originalPrice && (
                <span className="text-sm text-ink-3 line-through">{formatPrice(course.originalPrice)}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export const CourseRow = ({ course }) => {
  const instructor = getInstructor(course.instructor);
  return (
    <article className="group grid grid-cols-[96px_1fr] gap-4 border-b border-line py-6 sm:grid-cols-[200px_1fr_auto] sm:gap-8">
      <Link to={`/courses/${course.slug}`} data-cursor="View" aria-label={course.title}>
        <CourseCover course={course} size="sm" className="aspect-[4/3] rounded-xl" />
      </Link>
      <div className="min-w-0">
        <p className="eyebrow text-ink-3">
          {instructor?.name} <span className="mx-1.5 text-line-strong">/</span> {course.level}
        </p>
        <h3 className="mt-2 font-display text-xl leading-tight tracking-[-0.02em] sm:text-2xl">
          <Link to={`/courses/${course.slug}`} className="link-sweep">
            {course.title}
          </Link>
        </h3>
        <p className="mt-2 hidden max-w-xl text-sm text-ink-2 sm:block">{course.subtitle}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8rem] text-ink-2">
          <span className="inline-flex items-center gap-1.5">
            <span className="font-medium text-ink">{course.rating}</span>
            <Stars rating={course.rating} size={12} />
          </span>
          <span>{formatHours(course.totalMinutes)}</span>
          <span>{course.lessonCount} lessons</span>
          <span className="sm:hidden font-semibold text-ink">{formatPrice(course.price)}</span>
        </div>
      </div>
      <div className="hidden flex-col items-end justify-between sm:flex">
        <div className="text-right">
          <p className="text-lg font-semibold">{formatPrice(course.price)}</p>
          {course.originalPrice && <p className="text-sm text-ink-3 line-through">{formatPrice(course.originalPrice)}</p>}
        </div>
        <WishlistButton course={course} className="!bg-ink/8 !text-ink hover:!bg-ink/15 aria-pressed:!bg-lime aria-pressed:!text-coal" />
      </div>
    </article>
  );
};

export default CourseCard;
