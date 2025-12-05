import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './BlogPreview.css';

const BlogPreview = () => {
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

  const blogPosts = [
    {
      id: 1,
      title: 'Getting Started with AWS Cloud Practitioner',
      excerpt: 'My journey to AWS certification and tips for beginners looking to enter the cloud computing world.',
      date: '2024-12-01',
      readTime: '5 min read',
      tags: ['AWS', 'Cloud', 'Certification'],
      image: '☁️',
    },
    {
      id: 2,
      title: 'Building Modern React Applications',
      excerpt: 'Best practices and patterns I\'ve learned while developing React applications during my studies.',
      date: '2024-11-15',
      readTime: '8 min read',
      tags: ['React', 'JavaScript', 'Web Dev'],
      image: '⚛️',
    },
    {
      id: 3,
      title: 'From BTS SNIR to Master\'s Degree',
      excerpt: 'Reflecting on my educational journey in software development and what I\'ve learned along the way.',
      date: '2024-10-20',
      readTime: '6 min read',
      tags: ['Career', 'Education', 'Personal'],
      image: '🎓',
    },
  ];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <section id="blog" className="blog-preview" ref={sectionRef}>
      <div className="blog-container">
        <h2 className="section-title">Latest from the Blog</h2>
        <p className="section-subtitle">
          Thoughts, tutorials, and insights from my journey in software development
        </p>

        <div className="blog-grid">
          {blogPosts.map((post, index) => (
            <article 
              key={post.id} 
              className="blog-card"
              style={{ '--delay': `${index * 0.15}s` }}
            >
              <div className="blog-card-image">
                <span className="blog-emoji">{post.image}</span>
              </div>
              <div className="blog-card-content">
                <div className="blog-meta">
                  <span className="blog-date">{formatDate(post.date)}</span>
                  <span className="blog-separator">•</span>
                  <span className="blog-read-time">{post.readTime}</span>
                </div>
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                <div className="blog-tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="blog-tag">{tag}</span>
                  ))}
                </div>
                <Link to="/blog" className="blog-read-more">
                  Read More
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="blog-cta">
          <Link to="/blog" className="btn btn-primary">
            View All Posts
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
