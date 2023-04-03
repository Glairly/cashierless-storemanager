import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Image,
  Card,
} from "react-bootstrap";
import * as Navbar from "../components/Navbar";
import "./profile.scss";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

interface ProfileProp {
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
}

const mockProfile: ProfileProp = {
  firstName: "John",
  lastName: "Gaiyang",
  email: "62010889@kmitl.ac.th",
  photo:
    "https://static.vecteezy.com/system/resources/previews/007/033/146/original/profile-icon-login-head-icon-vector.jpg",
};

const Profile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const auth = useSelector((state: RootState) => state.auth.auth);

  return (
    <div className="profile">
      <Navbar.DashbaordNavbar />
      <Container className="mt-4">
        <Card className="rounded-5">
          <Row className="d-flex flex-row justify-content-center">
            <Col lg={8} className="py-2 px-4">
              <Card.Body>
                <div className="d-flex flex-row justify-content-between">
                  <div className="d-flex flex-column">
                    <h2 className="d-inline mb-0">Edit Profile</h2>
                    <p className="d-inline mb-0">
                      Store Manager will get to see you with the information
                      below
                    </p>
                  </div>
                  <div className="d-flex align-items-center">
                    <Button className="text-white me-2" disabled>
                      Cancel
                    </Button>
                    <Button className="text-white">Save</Button>
                  </div>
                </div>
                <Row className="d-flex justify-content-center">
                  <Col lg={4} className="d-flex flex-column align-items-center">
                    <p className="mt-4 mb-0">Photo</p>
                    <Image
                      className="profile-img rounded-5"
                      fluid
                      rounded
                      src={mockProfile.photo}
                    />
                    <Button className="text-white mt-3">Change</Button>
                  </Col>
                  <Col lg={8}>
                    <Form className="mt-4">
                      <Form.Group className="mb-2" controlId="formFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="firstName"
                          placeholder={user?.name || "First Name"}
                        />
                      </Form.Group>
                      <Form.Group className="mb-2" controlId="formLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="lastName"
                          placeholder={user?.name || "Last Name"}
                        />
                      </Form.Group>
                      <Form.Group className="mb-2" controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder={auth?.email || "Email"}
                        />
                      </Form.Group>
                      <Form.Group className="mb-2" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Has to be 8 letter or longer"
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formConfirmPassword"
                      >
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Has to be 8 letter or longer"
                        />
                      </Form.Group>
                    </Form>
                  </Col>
                </Row>
              </Card.Body>
            </Col>
            <Col lg={4} className="p-0">
              <Image
                className="w-100 h-100 rounded-end"
                src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/assortment-of-colorful-ripe-tropical-fruits-top-royalty-free-image-995518546-1564092355.jpg"
              ></Image>
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
};

export default Profile;
