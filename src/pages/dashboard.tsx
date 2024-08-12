import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {
    Dropdown,
    DropdownTrigger,
    Avatar,
    DropdownMenu,
    DropdownItem, Card, CardBody, CardHeader, Tabs, Tab, Button, Input, Chip
} from "@nextui-org/react";
import ListWorkflows from "../common/list-workflows";
import {useCreateWorkflow} from "../hooks/useCreateWorkflow";

interface Props {
    name: string;
    email: string;
    photoUrl: string;
}

const NavBar: React.FC<Props> = ({name, email, photoUrl}) => {
    const nameInitials = name.split(' ').map((n: string) => n[0]).join('');

    return (
        <header
            style={{backgroundColor: '#fafbff'}}
            className="d-flex flex-row justify-content-between px-4 py-2"
        >
            <div className="d-flex flex-row">
                <img src={`/assets/logo.png`} alt={`Logo Icon`} className="mr-3"
                     style={{width: "32px", height: "32px", "marginRight": '8px'}}/>
                <h4 className="font-bold text-inherit p-0 mt-2" style={{marginLeft: '-14px'}}>astflow</h4>
            </div>
            <div>
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Avatar
                            as="button"
                            className="transition-transform"
                            name={nameInitials}
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="configurations">About Us</DropdownItem>
                        <DropdownItem key="logout" color="danger">
                            Log Out
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </header>
    );
};

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [photoUrl, setPhotoUrl] = React.useState<string | null>(null);
    const [name, setName] = React.useState<string | null>(null);
    const [email, setEmail] = React.useState<string | null>(null);

    useEffect(() => {
        const email = localStorage.getItem('email');
        const name = localStorage.getItem('name');
        const photoUrl = localStorage.getItem('photoUrl');

        if (email === null || name === null) {
            // User data does not exist, redirect to the auth page
            navigate('/auth');
        }
        setEmail(email);
        setName(name);
        setPhotoUrl(photoUrl);

    }, [navigate]);

    const {updateWorkflow} = useCreateWorkflow(email || '');

    return (
        <div style={{backgroundColor: "#fafbff", minHeight: window.innerHeight}} >
            <NavBar name={name || ''} email={email || ''} photoUrl={photoUrl || ''}/>
            <div className="d-flex flex-row justify-content-between p-4">
                <div style={{marginRight: '32px', width: '100%'}}>
                    <div className="d-flex flex-row w-100 align-items-center ">
                        <h4>{`Welcome, ${name?.split(' ')[0]}`}</h4>
                    </div>
                    <div className="mt-3">
                        <Tabs aria-label="Options" size="lg" variant="light">
                            <Tab key="templates" title="Workflow Templates">
                                <ListWorkflows email={undefined}/>
                            </Tab>
                            <Tab key="your-workflows" title="Your Workflows">
                                <ListWorkflows email={email || undefined}/>
                            </Tab>
                        </Tabs>
                    </div>

                </div>
                <div>
                    <Button fullWidth color="primary" variant="bordered" onClick={updateWorkflow}>
                        Create New Workflow
                    </Button>
                    <Card style={{height: '200px', marginTop: '32px'}}>
                        <CardHeader>
                            <h5>Need Help?</h5>
                        </CardHeader>
                        <CardBody style={{height: '60px'}}>
                            <p style={{height: '60px'}}>Reach out to us on shivansh16tiwari@gmail.com</p>
                        </CardBody>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;