import React, {useCallback, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {
    Dropdown,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    DropdownTrigger,
    Avatar,
    DropdownMenu,
    DropdownItem, Card, CardBody, CardHeader, Tabs, Tab, Button, Input
} from "@nextui-org/react";
import ListWorkflows from "../common/list-workflows";
import {useCreateWorkflow} from "../hooks/useCreateWorkflow";
import AvailableNodes from "../views/available-nodes";

interface Props {
    name: string;
    email: string;
    photoUrl: string;
}

const NavBar: React.FC<Props> = ({name, email, photoUrl}) => {
    const nameInitials = name.split(' ').map((n: string) => n[0]).join('');

    const {updateWorkflow} = useCreateWorkflow(email);

    const createNewWorkflowWithToast = useCallback(async () => {
        updateWorkflow();
    }, [updateWorkflow]);

    return (
        <Navbar style={{marginTop: '8px', backgroundColor: '#fafbff'}}>
            <NavbarBrand style={{marginLeft: '-128px'}}>
                <img src={`/assets/logo.png`} alt={`Logo Icon`} className="mr-3"
                     style={{width: "32px", height: "32px", "marginRight": '8px'}}/>
                <h4 className="font-bold text-inherit p-0 mt-2" style={{marginLeft: '-14px'}}>astflow</h4>
            </NavbarBrand>
            <NavbarContent className="gap-4" justify="center">
                <NavbarItem>
                    <Button color="primary" variant="bordered" onClick={createNewWorkflowWithToast}>
                        Create New Workflow
                    </Button>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent as="div" justify="end" style={{marginRight: '-128px'}}>
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
            </NavbarContent>
        </Navbar>
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

    return (
        <div style={{backgroundColor: "#fafbff"}}>
            <NavBar name={name || ''} email={email || ''} photoUrl={photoUrl || ''}/>
            <div className="d-flex flex-row justify-content-between p-4">
                <div style={{marginRight: '32px', width: '100%'}}>
                    <div className="d-flex flex-row w-100 align-items-center ">
                        <h4>{`Welcome, ${name?.split(' ')[0]}`}</h4>
                    </div>
                    <div className="mt-3">
                        <Tabs aria-label="Options" size="lg" variant="light">
                            <Tab key="templates" title="Workflow Templates">
                                <Card>
                                    <CardBody>
                                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                        aliquip
                                        ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                                        velit
                                        esse cillum dolore eu fugiat nulla pariatur.
                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab key="your-workflows" title="Your Workflows">
                                <ListWorkflows/>
                            </Tab>

                            <Tab key="nodes" title="Nodes">
                                <AvailableNodes onSelectNode={() => {

                                }} onClose={() => {}} />
                            </Tab>
                        </Tabs>
                    </div>

                </div>
                <div>
                    <Card style={{height: '200px'}}>
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