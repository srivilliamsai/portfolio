import React from 'react';
import SEO from '../components/common/SEO';
import BlogCard from '../components/blog/BlogCard';
import { blogPosts } from '../data/blogs';

export default function BlogIndex() {
  return (
    <>
      <SEO
        title="Blog | Sri Villiam Sai"
        description="Build notes and practical walkthroughs on Java, React, SwiftUI, and the interactive features in Sri Villiam Sai’s portfolio."
        canonical="/blog"
      />

      <section aria-labelledby="blog-section-heading" className="bg-background section-padding-y border-b">
        <div className="container-padding-x container mx-auto">
          <div className="flex flex-col items-start gap-10 md:gap-12">
            <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center">
              <div className="flex items-center justify-center w-fit gap-1 [&_svg]:size-3.5 [&_svg]:shrink-0 bg-transparent text-muted-foreground font-mono uppercase text-xs tracking-[0.25em] font-normal">
                Blog
              </div>
              <h1 className="heading-xl" id="blog-section-heading">
                Tech thoughts
              </h1>
              <p className="text-muted-foreground">
                Build notes, experiments, and practical walkthroughs from Java services to React screens and native SwiftUI interfaces.
              </p>
            </div>
            <ul className="portfolio-card-grid blog-card-grid w-full" aria-label="Blog posts">
              {blogPosts.map((post) => <BlogCard key={post.slug} post={post} />)}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
