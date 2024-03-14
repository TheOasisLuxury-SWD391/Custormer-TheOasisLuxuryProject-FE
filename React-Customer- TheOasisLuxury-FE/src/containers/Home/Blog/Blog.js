import React, { useCallback, useEffect, useState } from 'react';
import { Carousel } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BLOG_DETAIL_PAGE } from 'settings/constant';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const Blog = () => {
  const navigate = useNavigate();

  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(false);


  // Fetch danh sách bài blog
  const fetchBlogPosts = useCallback(async () => {
    const token = localStorage.getItem('token'); // Assuming token-based authentication

    setLoading(true);
    try {
      // Không cần Authorization nếu API không yêu cầu
      const response = await fetch("http://localhost:5000/api/v1/users/get/blogPosts",{
        headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the request headers
          },
      });
      if (response.ok) {
        const data = await response.json();
        setBlogPosts(data.result || []);
      } else {
        console.error("Failed to fetch blog posts with status: ", response.status);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

   // Kích hoạt fetchBlogPosts một lần khi component mount
   useEffect(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  const groupedBlogPosts = [];
  for(let i = 0; i < blogPosts.length; i += 3) {
    groupedBlogPosts.push(blogPosts.slice(i, i + 3));
  }


  const handleClick = () => {
    navigate(BLOG_DETAIL_PAGE);
  }

  const PrevArrow = (props) => (
    <div {...props} className="bg-gray-400 bg-opacity-50 text-white rounded-full flex items-center justify-center w-8 h-8 cursor-pointer carousel-prev">
      <LeftOutlined />
    </div>
  );
  
  const NextArrow = (props) => (
    <div {...props} className="bg-gray-400 bg-opacity-50 text-white rounded-full flex items-center justify-center w-8 h-8 cursor-pointer carousel-next">
      <RightOutlined />
    </div>
  );

  return (
    <div className='max-w-screen-xl mx-auto'>
      <h1 className='font-bold text-xl mt-4 mb-6'> BLOG TIMESHARE VILLAS</h1>
      <Carousel autoplay autoplaySpeed={2000} dots={false} prevArrow={<PrevArrow />} nextArrow={<NextArrow />}>
        {groupedBlogPosts.map((group, index) => (
          <div key={index} className="!flex justify-around items-center p-5 ">
            {group.map((post) => (
              <div key={post._id} className="text-center p-4 w-80  h-fit rounded-md transition-shadow duration-300 ease-in-out hover:shadow-2xl" onClick={() => handleClick(post._id)}>
                <img src={post.url_image} alt={post.title} className="w-full rounded h-48 object-cover mx-auto" />
                <h2 className="text-xl font-bold mt-2 cursor-pointer">{post.title}</h2>
                <p className="text-gray-700 text-base">{post.description_detail}</p>
              </div>
            ))}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Blog;
