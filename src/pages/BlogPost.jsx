import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import BlogCard from '../components/blog/BlogCard';
import { blogPosts } from '../data/blogs';
import { scrollToSection } from '../utils/scroll';
import NotFound from './NotFound';

export default function BlogPost() {
  const { slug } = useParams();
  // Strip .html if requested with extension
  const cleanSlug = slug ? slug.replace(/\.html$/, '') : '';
  const post = blogPosts.find((p) => p.slug === cleanSlug);

  if (!post) {
    return <NotFound />;
  }

  const otherPosts = blogPosts.filter((p) => p.slug !== cleanSlug).slice(0, 3);

  return (
    <>
      <SEO
        title={`${post.title} | Sri Villiam Sai`}
        description={post.description}
        canonical={`/blog/${post.slug}`}
      />

      <section aria-labelledby="article-title" className="bg-background section-padding-y border-b">
        <div className="container-padding-x container mx-auto">
          <article className="flex flex-col gap-12 md:gap-16">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center md:gap-6">
              <Link className="portfolio-text-link" to="/blog">← Back to blog</Link>
              <h1 className="heading-xl" id="article-title">
                {post.title}
              </h1>
              <p className="text-muted-foreground text-lg">{post.description}</p>
              <div className="flex items-center gap-2">
                <time className="text-muted-foreground text-sm" dateTime={post.publishedAt}>{post.date}</time>
                <span className="text-muted-foreground text-sm">·</span>
                <p className="text-muted-foreground text-sm">{post.category}</p>
              </div>
            </div>

            <p className="article-scope mx-auto max-w-3xl">{post.scope || 'Writing sample. Scenarios, dialogue and code snippets in this article are illustrative; project case studies document my implementation work.'}</p>
            <div className="blog-article-layout">
              <div className="blog-article-body flex flex-col gap-8">
                <div data-radix-aspect-ratio-wrapper="" style={{ position: 'relative', width: '100%', paddingBottom: '75%' }}>
                  <div data-slot="aspect-ratio" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
                    <img
                      alt={post.imageAlt || post.title}
                      className="h-full w-full rounded-xl object-cover"
                      data-nimg="fill"
                      decoding="async"
                      loading="lazy"
                      sizes="100vw"
                      src={post.image}
                      style={{
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        color: 'transparent'
                      }}
                    />
                  </div>
                </div>

                <div
                  className="prose prose-lg w-full prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>

              {post.toc && post.toc.length > 0 && (
                <aside className="blog-article-toc" aria-label="Article contents">
                  <h2 className="text-sm font-medium">On this page</h2>
                  <div className="flex flex-col gap-3 text-sm text-muted-foreground font-light">
                    {post.toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="hover:text-primary transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(item.id);
                        }}
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                </aside>
              )}
            </div>
          </article>
        </div>
      </section>

      {/* More from the blog */}
      <section aria-labelledby="related-blog-section-heading" className="bg-background section-padding-y border-b">
        <div className="container-padding-x container mx-auto">
          <div className="flex flex-col items-start gap-10 md:gap-12">
            <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center">
              <h2 className="heading-lg" id="related-blog-section-heading">
                More from the blog
              </h2>
            </div>
            <ul className="portfolio-card-grid blog-card-grid w-full" aria-label="More blog posts">
              {otherPosts.map((other) => <BlogCard key={other.slug} post={other} headingLevel={3} prefix="related" />)}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
