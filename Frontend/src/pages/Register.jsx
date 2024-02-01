import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Register() {
  const [fullname, setFullname] = useInputState("");
  const [username, setUsername] = useInputState("");
  const [email, setEmail] = useInputState("");
  const [password, setPassword] = useInputState("");

  const navigate = useNavigate();
  const LoginGuest = () => {
    return;
  };

  const RegisterUser = async () => {
    function checkPassword(password) {
      const minLength = 8;
      const maxLength = 12;

      const uppercaseRegex = /[A-Z]/;
      const lowercaseRegex = /[a-z]/;
      const numberRegex = /\d/;
      const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;

      if (password.length < minLength || password.length > maxLength) {
        return "Password must be between " + minLength + " and " + maxLength + " characters long.";
      }

      if (!uppercaseRegex.test(password)) {
        return "Password must include at least one uppercase letter.";
      }

      if (!lowercaseRegex.test(password)) {
        return "Password must include at least one lowercase letter.";
      }

      if (!numberRegex.test(password)) {
        return "Password must include at least one number.";
      }

      if (!specialCharRegex.test(password)) {
        return "Password must include at least one special character (!, @, #, $, etc.).";
      }

      return "Password is valid!";
    }

    if (!fullname || !username || !email || !password) {
      return toast.error("Please fill all input fields");
    } else if (checkPassword(password) !== "Password is valid!") {
      return toast.error(checkPassword(password));
    } else {
      await axios
        .post(
          `${import.meta.env.VITE_API}/users/register`,
          { username, fullname, email, password },
          {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
          }
        )
        .then(({ data }) => {
          if (data.user) {
            toast.success("User successfully registered");
            navigate("/login", { replace: true });
          } else {
            toast.error("An error occured while registering");
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.error);
        });
    }
  };
  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
      >
        Sign Up fast
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Already have an account ?{" "}
        <Anchor size="sm" component="button">
          <Link to={"/login"}>Login</Link>
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput label="Full Name" value={fullname} onChange={setFullname} placeholder="Ramesh" required />
        <TextInput label="Email" value={email} onChange={setEmail} placeholder="+977" required mt={"md"} />
        <TextInput
          label="Username"
          value={username}
          onChange={setUsername}
          placeholder="WookyDooky28"
          required
          mt={"md"}
        />
        <PasswordInput
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Your password"
          required
          mt={"md"}
        />
        <Group position="apart" mt="lg">
          <Checkbox label="Remember me" />
          <Anchor component="button" size="sm">
            Forgot password?
          </Anchor>
        </Group>
        <Button fullWidth mt="xl" onClick={RegisterUser}>
          Register
        </Button>
        <Button fullWidth mt={"sm"} variant="outline" onClick={LoginGuest}>
          Login as Guest
        </Button>
      </Paper>
    </Container>
  );
}
