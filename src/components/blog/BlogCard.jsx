import React from 'react';
import { Link } from 'react-router-dom';

export default function BlogCard({ post, headingLevel = 2, prefix = 'blog' }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const titleId = `${prefix}-${post.slug}-title`;
  return (
    <li className="blog-card-item">
      <Link className="blog-card-link" to={`/blog/${post.slug}`} aria-labelledby={titleId}>
        <article className="blog-card group" data-slot="card">
          <div className="blog-card-content" data-slot="card-content">
            <div className="blog-card-meta text-muted-foreground">
              <time dateTime={post.publishedAt}>{post.date}</time>
              <span aria-hidden="true">·</span>
              <span>{post.category}</span>
            </div>
            <Heading className="blog-card-title text-base leading-normal font-semibold" id={titleId}>{post.title}</Heading>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-normal">{post.description}</p>
          </div>
          <div className="blog-card-cover" data-slot="card-footer">
            <img
              alt={post.imageAlt || `${post.title} thumbnail`}
              src={post.image}
              width="1200"
              height="900"
              loading="lazy"
              decoding="async"
            />
          </div>
        </article>
      </Link>
    </li>
  );
}
