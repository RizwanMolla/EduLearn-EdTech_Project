import { useRef } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, Link2 } from 'lucide-react';
import { gsap, useGSAP } from '../lib/gsap';
import { articles, getArticle } from '../data/articles';
import { getInstructor } from '../data/instructors';
import { coursesByInstructor } from '../data/courses';
import { ArticleCard } from './Journal';
import { SectionLabel } from '../components/ui/Bits';
import { CourseCard } from '../components/course/CourseCard';
import NotFound from './NotFound';
import { useToast } from '../hooks/useToast';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageTitle } from '../hooks/usePageTitle';
import { formatDate } from '../lib/format';

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const Article = () => {
  const { slug } = useParams();
  const article = getArticle(slug);
  const root = useRef(null);
  const toast = useToast();
  usePageTitle(article?.title || 'Article not found');
  useScrollReveal(root);

  // Reading progress bar
  useGSAP(() => {
    if (!article) return;
    gsap.to('.read-progress', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.article-body', start: 'top 30%', end: 'bottom 70%', scrub: true },
    });
  }, { scope: root, dependencies: [slug] });

  if (!article) return <NotFound />;

  const author = getInstructor(article.author);
  const headings = article.body.filter((b) => b.h2).map((b) => b.h2);
  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 3);
  const course = coursesByInstructor(author.id)[0];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link copied', tone: 'info' });
    } catch {
      toast({ title: 'Could not copy the link', tone: 'error' });
    }
  };

  return (
    <div ref={root} className="pb-28">
      <div className="fixed inset-x-0 top-0 z-[60] h-[3px]" aria-hidden="true">
        <div className="read-progress h-full origin-left scale-x-0 bg-clay" />
      </div>

      <header className="shell pt-32 sm:pt-40">
        <Link to="/journal" className="eyebrow inline-flex items-center gap-2 text-ink-3 hover:text-ink" data-reveal>
          <ArrowLeft size={13} /> The Journal
        </Link>
        <p className="eyebrow mt-10 text-ink-3" data-reveal>
          {article.category} / {article.readTime} min read / {formatDate(article.date)}
        </p>
        <h1 data-split className="display-lg mt-5 max-w-5xl">
          {article.title}
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-relaxed text-ink-2" data-reveal>
          {article.excerpt}
        </p>
        <Link to={`/instructors/${author.id}`} className="mt-8 inline-flex items-center gap-3" data-reveal>
          <img src={author.photo} alt="" className="size-11 rounded-full object-cover" />
          <span className="text-sm">
            <span className="block font-medium">{author.name}</span>
            <span className="block text-ink-3">{author.role}</span>
          </span>
        </Link>
      </header>

      <div className="shell mt-14">
        <div className="relative aspect-[21/9] overflow-hidden rounded-3xl">
          <img src={article.image} alt="" className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover" data-parallax="0.08" />
        </div>
      </div>

      <div className="shell mt-16 grid gap-12 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-28">
            <p className="eyebrow text-ink-3">In this piece</p>
            <ol className="mt-4 space-y-3 border-l border-line">
              {headings.map((h) => (
                <li key={h}>
                  <a href={`#${slugify(h)}`} data-transition="off" className="-ml-px block border-l border-transparent pl-4 text-sm text-ink-2 transition hover:border-ink hover:text-ink">
                    {h}
                  </a>
                </li>
              ))}
            </ol>
            <button type="button" onClick={copy} className="mt-8 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm transition hover:border-ink">
              <Link2 size={14} /> Copy link
            </button>
          </div>
        </aside>

        <article className="article-body prose-edu max-w-[68ch] lg:col-span-7">
          {article.body.map((block, i) => {
            if (block.h2) return <h2 key={i} id={slugify(block.h2)} className="scroll-mt-28">{block.h2}</h2>;
            if (block.quote) return <blockquote key={i}>{block.quote}</blockquote>;
            if (block.list)
              return (
                <ul key={i}>
                  {block.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            return (
              <p key={i} className={i === 0 ? 'first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:font-display first-letter:text-[4.2rem] first-letter:leading-[0.8] first-letter:text-ink' : undefined}>
                {block.p}
              </p>
            );
          })}

          <div className="mt-16 flex items-center gap-5 rounded-3xl border border-line bg-card p-6 not-prose">
            <img src={author.photo} alt="" className="size-16 rounded-full object-cover" />
            <div>
              <p className="text-sm text-ink-3">Written by</p>
              <p className="font-display text-2xl text-ink">{author.name}</p>
              <p className="mt-1 text-sm">{author.bio.split('. ')[0]}.</p>
            </div>
          </div>
        </article>
      </div>

      {course && (
        <section className="shell mt-24">
          <SectionLabel>Learn more from {author.name.split(' ')[0]}</SectionLabel>
          <div className="mt-8 max-w-md">
            <CourseCard course={course} />
          </div>
        </section>
      )}

      <section className="shell mt-24 border-t border-line pt-16">
        <SectionLabel>Keep reading</SectionLabel>
        <div className="mt-10 grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
          {related.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Article;
