import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DetailBlog = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    // Fetch dữ liệu blog post sử dụng `id`...
    // Giả sử fetch thành công và bạn lưu trữ kết quả vào `post`
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="blog-detail">
      <div className="blog-image" style={{ backgroundImage: `url(${post.imageUrl})` }}></div>
      <h1 className="blog-title">{post.title}</h1>
      <p className="blog-content">{post.content}</p>
    </div>
  );
};

export default DetailBlog;
