import { useState, useEffect, useRef } from 'react';
import './Blog.css';

const Blog = () => {
  const [filter, setFilter] = useState('all');
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const categories = [
    { id: 'all', label: 'All Posts' },
    { id: 'aws', label: 'AWS & Cloud' },
    { id: 'webdev', label: 'Web Dev' },
    { id: 'career', label: 'Career' },
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'Getting Started with AWS Cloud Practitioner',
      excerpt: 'My journey to AWS certification and tips for beginners looking to enter the cloud computing world. Learn about the best resources and study strategies.',
      date: '2024-12-01',
      readTime: '5 min read',
      category: 'aws',
      tags: ['AWS', 'Cloud', 'Certification'],
      image: '☁️',
      featured: true,
    },
    {
      id: 2,
      title: 'Building Modern React Applications',
      excerpt: 'Best practices and patterns I\'ve learned while developing React applications during my studies. From component architecture to state management.',
      date: '2024-11-15',
      readTime: '8 min read',
      category: 'webdev',
      tags: ['React', 'JavaScript', 'Web Dev'],
      image: '⚛️',
      featured: true,
    },
    {
      id: 3,
      title: 'From BTS SNIR to Master\'s Degree',
      excerpt: 'Reflecting on my educational journey in software development and what I\'ve learned along the way. The challenges, the wins, and everything in between.',
      date: '2024-10-20',
      readTime: '6 min read',
      category: 'career',
      tags: ['Career', 'Education', 'Personal'],
      image: '🎓',
      featured: false,
    },
    {
      id: 4,
      title: 'Understanding AWS EC2 Basics',
      excerpt: 'A deep dive into Amazon EC2, the backbone of AWS compute services. Learn about instance types, pricing models, and best practices for deployment.',
      date: '2024-10-05',
      readTime: '7 min read',
      category: 'aws',
      tags: ['AWS', 'EC2', 'Infrastructure'],
      image: '🖥️',
      featured: false,
    },
    {
      id: 5,
      title: 'CSS Variables and Theming',
      excerpt: 'How to implement a robust theming system using CSS custom properties. Create light and dark modes with minimal JavaScript.',
      date: '2024-09-18',
      readTime: '5 min read',
      category: 'webdev',
      tags: ['CSS', 'Theming', 'Frontend'],
      image: '🎨',
      featured: false,
    },
    {
      id: 6,
      title: 'My First Year as a Developer',
      excerpt: 'Lessons learned, mistakes made, and growth achieved during my first year of serious software development. A retrospective.',
      date: '2024-09-01',
      readTime: '10 min read',
      category: 'career',
      tags: ['Career', 'Reflection', 'Growth'],
      image: '🚀',
      featured: false,
    },
  ];

  const filteredPosts = filter === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === filter);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <main className="blog-page" ref={sectionRef}>
      <div className="blog-hero">
        <div className="blog-hero-bg"></div>
        <div className="blog-hero-content">
          <h1>Blog</h1>
          <p>Thoughts, tutorials, and insights from my journey</p>
        </div>
      </div>

      <div className="blog-container">
        {/* Filter Tabs */}
        <div className="blog-filters">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
              onClick={() => setFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="blog-posts-grid">
          {filteredPosts.map((post, index) => (
            <article 
              key={post.id} 
              className={`blog-post-card ${post.featured ? 'featured' : ''}`}
              style={{ '--delay': `${index * 0.1}s` }}
            >
              <div className="post-image">
                <span className="post-emoji">{post.image}</span>
                {post.featured && (
                  <span className="featured-badge">Featured</span>
                )}
              </div>
              <div className="post-content">
                <div className="post-meta">
                  <span className="post-date">{formatDate(post.date)}</span>
                  <span className="post-separator">•</span>
                  <span className="post-read-time">{post.readTime}</span>
                </div>
                <h2 className="post-title">{post.title}</h2>
                <p className="post-excerpt">{post.excerpt}</p>
                <div className="post-tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="post-tag">{tag}</span>
                  ))}
                </div>
                <button className="read-more-btn">
                  Read Article
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="no-posts">
            <span className="no-posts-icon">📝</span>
            <p>No posts in this category yet. Check back soon!</p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="newsletter-cta">
          <div className="newsletter-content">
            <h3>Stay Updated</h3>
            <p>Get notified when I publish new content. No spam, just quality articles.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="newsletter-input"
              />
              <button type="submit" className="btn btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Blog;
