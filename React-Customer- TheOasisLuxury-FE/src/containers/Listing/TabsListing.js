import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Col, Row, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import Container from 'components/UI/Container/Container';
import Breadcrumbs from 'components/UI/Breadcrumbs';
import BackButton from 'components/UI/ButtonBACK';
import { HOME_PAGE, LISTING_POSTS_PAGE, ORDER_HISTORY } from 'settings/constant';
import ListingPage from './Listing';
import { VillaContext } from 'context/VillaContext';
import ListingPageAll from './ListingAll';

const TabListing = () => {
    const navigate = useNavigate();
  const { villas } = useContext(VillaContext);

    const [currentCategory, setCurrentCategory] = useState('all');
    const [subdivisions, setSubdivisions] = useState([]);
    console.log('subdivisions',subdivisions);

    const handleBackClick = () => {
        navigate(`/`);
    };

    useEffect(() => {
        const fetchSubdivisions = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/v1/subdivisions/");
                if (response.ok) {
                    const data = await response.json();
                    setSubdivisions(data.result || []); // Ensure subdivisions is an array, even if data.result is undefined
                } else {
                    console.error("Failed to fetch subdivisions with status: " + response.status);
                }
            } catch (error) {
                console.error("Error fetching subdivisions:", error);
            } 
        };
    
        fetchSubdivisions();
    }, []);
    

    const breadcrumbs = [
        { title: 'Home', href: HOME_PAGE },
        { title: 'Listing', href: LISTING_POSTS_PAGE },
        // Thêm các breadcrumb khác nếu cần
    ];

    return (
        <div>
            <Container>
                <Row gutter={30} id="tourOverviewSection" style={{ marginTop: 30 }}>
                    <Col span={24} className='flex'>
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                        <BackButton />
                    </Col>
                </Row>
            </Container>
            <div>
                <h2 className="text-xl font-bold text-center m-10">LISTING VILLAS BY SUBDIVISION</h2>
                <Tabs defaultActiveKey="1" centered >
                    <Tabs.TabPane tab="All" key="1" >
                        <ListingPageAll />
                    </Tabs.TabPane>
                    {subdivisions.map(subdivision => (
                        <Tabs.TabPane tab={subdivision.subdivision_name} key={subdivision._id}>
                            <ListingPage subdivisions={[subdivision]}  />
                        </Tabs.TabPane>
                    ))}
                </Tabs>
            </div>
        </div>
    );
};

export default TabListing;
