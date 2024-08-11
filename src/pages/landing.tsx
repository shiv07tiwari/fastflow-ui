import React, {useEffect} from 'react';
import { Container, Row, Col, Button, Form, FormGroup, FormControl, Card, Carousel } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {useNavigate} from "react-router-dom";

const HeroSection: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ width: '100%' }} // Ensure this div is full width
        >
            <Container fluid style={{ background: 'linear-gradient(45deg, #6a11cb, #2575fc)', color: 'white', padding: '100px 0' }} className="text-center">
                <Row>
                    <Col>
                        <h1 style={{ fontWeight: '700' }}>Create Your Automation Workflows</h1>
                        <p>Visualize, build, and optimize your data workflows with ease.</p>
                        <Button variant="light" href="#demo" size="lg">Try It Now</Button>
                    </Col>
                </Row>
            </Container>
        </motion.div>
    );
};

// Carousel for Features with enhanced interaction
const FeaturesCarousel: React.FC = () => {
    return (
        <Carousel>
            <Carousel.Item>
                <img className="d-block w-100" src="https://via.placeholder.com/800x400?text=Feature+One" alt="First slide" />
                <Carousel.Caption>
                    <h3>First feature title</h3>
                    <p>This is a description for the first feature.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img className="d-block w-100" src="https://via.placeholder.com/800x400?text=Feature+Two" alt="Second slide" />
                <Carousel.Caption>
                    <h3>Second feature title</h3>
                    <p>This is a description for the second feature.</p>
                </Carousel.Caption>
            </Carousel.Item>
            {/* Add more slides as needed */}
        </Carousel>
    );
};

// Features Section with a dynamic approach using a Carousel
const FeaturesSection: React.FC = () => (
    <Container className="my-5">
        <Row>
            <Col>
                <h2 className="text-center mb-4">Features Overview</h2>
                <FeaturesCarousel />
            </Col>
        </Row>
    </Container>
);

// Demo Section with improved layout for better engagement
const DemoSection: React.FC = () => (
    <Container fluid id="demo" className="my-5 py-5" style={{ backgroundColor: '#eff6ff', borderRadius: '5px' }}>
        <Row className="justify-content-center">
            <Col md={6}>
                <h2 className="text-center">Get Started</h2>
                <Form>
                    <FormGroup className="mb-3" controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <FormControl type="email" placeholder="Enter email" className="rounded-0" />
                    </FormGroup>
                    <Button variant="primary" type="submit" size="lg" className="w-100">Sign Up For Free</Button>
                </Form>
            </Col>
        </Row>
    </Container>
);

// Footer with simple copyright function
const Footer: React.FC = () => (
    <Container className="text-center my-4">
        <span>Copyright © {new Date().getFullYear()} FastFlow</span>
    </Container>
);

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const email = localStorage.getItem('email');
        const name = localStorage.getItem('name');

        if (email === null || name === null) {
            // User data does not exist, redirect to the auth page
            navigate('/auth');
        }
    }, [navigate]);

    return (
        <div>
            <HeroSection />
            <FeaturesSection />
            <DemoSection />
            <Footer />
        </div>
    );
};

export default LandingPage;