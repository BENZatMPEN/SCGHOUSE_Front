import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const LoginPage: FC = () => {
    const navigate = useNavigate();
    const [messageError, setMessageError] = useState("");
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: Yup.object().shape({
            username: Yup.string().required("Invalid username or password"),
            password: Yup.string().required("Invalid username or password"),
        }),
        onSubmit(values) {
            axios
                .post(`${process.env.REACT_APP_BACKEND_API_ENDPOINT}/api/login`, {
                    username: values.username,
                    password: values.password,
                })
                .then((res) => {
                    if (res.data.code === "INFO_0000") {
                        window.localStorage.setItem("access_token", res.data.message.access_token);
                        window.localStorage.setItem("refresh_token", res.data.message.refresh_token);
                        navigate("/house-report");
                    }
                })
                .catch((e) => {
                    if (e?.response !== undefined) {
                        setMessageError(e?.response?.data?.message);
                    } else {
                        setMessageError(e.message);
                    }
                    console.error(e?.response)
                });
        },
    });

    return (
        <Box
            component="main"
            className="w-full min-h-screen bg-light-gray-01 flex flex-col justify-center items-center gap-y-20"
        >
            <Box
                className="max-w-[520px] mx-auto bg-white py-10 px-8 rounded-lg"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Box className="flex flex-col justify-center items-center mb-5">
                    <Avatar className="bg-purple-01 mb-3">
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" className="text-[30px] text-dark-01 font-bold leading-10">
                        Welcome
                    </Typography>
                    <Typography className="text-lg text-light-gray-02">Sign in to your account</Typography>
                </Box>
                <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                    <Box>
                        <TextField
                            id="username"
                            name="username"
                            label="Username"
                            className="mb-5"
                            fullWidth
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <TextField
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            className="mb-[3rem]"
                            fullWidth
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {(formik.errors.username || formik.errors.password) &&
                            (formik.touched.username || formik.touched.password) && (
                                <Typography className="text-sm text-red-01 -mt-[2.5rem] mb-[3rem]">
                                    {formik.errors.username || formik.errors.password}
                                </Typography>
                            )}
                    </Box>
                    {messageError && (
                        <Typography className="text-sm text-red-01 -mt-[2.5rem] mb-[3rem]">{messageError}</Typography>
                    )}
                    {/* <FormControlLabel control={<Checkbox value="remember" />} label="Remember me" /> */}
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        className="py-3 bg-purple-01 text-sm font-bold hover:!bg-white hover:!outline hover:!outline-2 hover:!outline-purple-01 hover:!text-purple-01 hover:!shadow-none"
                    >
                        Sign In
                    </Button>
                    {/* <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/register" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid> */}
                </Box>
            </Box>
            <Copyright />
        </Box>
    );
};

const Copyright = () => {
    return <Typography className="text-dark-01">Copyright &copy; 2023.</Typography>;
};

export default LoginPage;
