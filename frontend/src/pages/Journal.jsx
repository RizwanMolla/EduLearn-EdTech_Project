import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';
import { articles } from '../data/articles';
import { getInstructor } from '../data/instructors';
import { PageHeader } from '../components/ui/Bits';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageTitle } from '../hooks/usePageTitle';
import { formatDate } from '../lib/format';

export const ArticleCard = ({ article }) => {
  const author = getInstructor(article.author);
  return (
    <Link to={`/journal/${article.slug}`} className="group block" data-cursor="Read">
      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-paper-2">
        <img src={article.image} alt="" loading="lazy" className="media-tone size-full object-cover group-hover:scale-105 group-hover:grayscale-0" />
      </div>
      <p className="eyebrow mt-5 text-ink-3">
        {article.category} <span className="mx-1.5 text-line-strong">/</span> {article.readTime} min read
      </p>
      <h3 className="mt-3 font-display text-2xl leading-[1.12] tracking-[-0.025em]">
        <span className="link-sweep">{article.title}</span>
      </h3>
      <p className="mt-3 line-clamp-2 text-ink-2">{article.excerpt}</p>
      <p className="mt-4 flex items-center gap-2.5 text-sm text-ink-3">
        <img src={author.photo} alt="" className="size-7 rounded-full object-cover" loading="lazy" />
        {author.name} / {formatDate(article.date)}
      </p>
    </Link>
  );
};

const Journal = () => {
  const root = useRef(null);
  const [filter, setFilter] = useState('All');
  usePageTitle('Journal');
  useScrollReveal(root);

  const categories = ['All', ...new Set(articles.map((a) => a.category))];
  const featured = articles.find((a) => a.featured);
  const rest = articles.filter((a) => a !== featured && (filter === 'All' || a.category === filter));
  const featuredAuthor = getInstructor(featured.author);

  return (
    <div ref={root} className="pb-28">
      <PageHeader label="The Journal" title="Notes on learning, craft and careers." />

      <div className="shell">
        <Link to={`/journal/${featured.slug}`} className="group grid gap-8 lg:grid-cols-12 lg:items-center" data-cursor="Read" data-reveal>
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl lg:col-span-7">
            <img src={featured.image} alt="" className="media-tone absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover group-hover:grayscale-0" data-parallax="0.06" />
            <span className="absolute top-4 left-4 rounded-full bg-lime px-3 py-1 text-xs font-medium text-coal">Featured</span>
          </div>
          <div className="lg:col-span-5">
            <p className="eyebrow text-ink-3">
              {featured.category} / {featured.readTime} min read
            </p>
            <h2 className="display-md mt-4">
              <span className="link-sweep">{featured.title}</span>
            </h2>
            <p className="mt-5 text-lg text-ink-2">{featured.excerpt}</p>
            <div className="mt-8 flex items-center justify-between">
              <span className="flex items-center gap-3 text-sm">
                <img src={featuredAuthor.photo} alt="" className="size-10 rounded-full object-cover" />
                <span>
                  <span className="block font-medium">{featuredAuthor.name}</span>
                  <span className="block text-ink-3">{formatDate(featured.date)}</span>
                </span>
              </span>
              <span className="grid size-12 place-items-center rounded-full border border-line transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                <ArrowUpRight size={18} />
              </span>
            </div>
          </div>
        </Link>

        <div className="no-scrollbar -mx-4 mt-24 flex gap-2 overflow-x-auto border-t border-line px-4 pt-8" role="tablist" aria-label="Filter articles">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={filter === c}
              onClick={() => setFilter(c)}
              className={clsx(
                'shrink-0 rounded-full border px-4 py-2 text-sm transition-colors',
                filter === c ? 'border-ink bg-ink text-paper' : 'border-line text-ink-2 hover:border-ink hover:text-ink'
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div key={filter} className="mt-12 grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <div key={article.slug} className="animate-[pop-in_0.7s_cubic-bezier(0.16,1,0.3,1)_both]">
              <ArticleCard article={article} />
            </div>
          ))}
          {rest.length === 0 && <p className="text-ink-3">The featured story is the only one in this category so far.</p>}
        </div>
      </div>
    </div>
  );
};

export default Journal;
