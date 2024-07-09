import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography, useTheme, useMediaQuery } from '@mui/material';
import emailjs from "emailjs-com";
import Header from "./Header";
import Footer from "./Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Contact.css';

export default function Contact() {
  const navigate = useNavigate();
  const [isSent, setIsSent] = useState(false);
  const form = useRef();

  const validate = (values) => {
    let errors = {};

    if (!values.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
    },
    validate,
  });

  //入力情報の初期化
  const reset = () => {
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    name.value = "";
    email.value = "";
    message.value = "";

    localStorage.setItem("name", name.value);
    localStorage.setItem("email", email.value);
    localStorage.setItem("message", message.value);
  };

  //入力データを転送
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSent(true);

    emailjs
      .sendForm(
        "service_g855gzi",
        "template_n3clx2p",
        form.current,
        "S96X1DSvrk5YIziBd"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  //入力データをローカルストレージに保存
  const handleNameChange = (e) => {
    localStorage.setItem("name", e.target.value);
  };

  const handleEmailChange = (e) => {
    formik.handleChange(e);
    localStorage.setItem("email", e.target.value);
  };

  const handleMessageChange = (e) => {
    localStorage.setItem("message", e.target.value);
  };

  //ページ起動時保存データを入力
  useEffect(() => {
    let name_value = localStorage.getItem("name");
    let email_value = localStorage.getItem("email");
    let message_value = localStorage.getItem("message");

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    name.value = name_value;
    email.value = email_value;
    message.value = message_value;
  }, []);

  //レスポンシブ対応
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const isSm = useMediaQuery(theme.breakpoints.up('sm') && theme.breakpoints.down('md'));
  const isMd = useMediaQuery(theme.breakpoints.up('md') && theme.breakpoints.down('lg'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  const getVariant = () => {
    if (isXs) return 'h8';
    if (isSm) return 'h7';
    if (isMd) return 'h6';
    if (isLg) return 'h5';
  };

  return (
    <div className="Contact">
      <div id='header' className='d-inline-flex p-2'>
        <img src={`${process.env.PUBLIC_URL}/img/COOK_WITH_transparent_black.png`} alt="COOK_WITH icon" id='cook-with-icon' />
        <Header />
      </div>
      {isSent ? (
        <div className="sentMessage align-items-center">
          <p>送信が完了しました。</p>
          <button type="button" id='back-button' className="btn btn-outline-dark d-flex align-items-center m-3" onClick={() => navigate('/')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-left me-2" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
              <path fillRule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
            </svg>
            ホームへ戻る
          </button>
        </div>
      ) : (
        <form ref={form} onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f8f9fa', fontFamily: 'serif' }}>
            <Card sx={{ minWidth: '50vw', maxWidth: '90vw', height: '70vh', padding: 2, boxShadow: 3, position: 'relative' }}>
              <CardContent>
                <div className="d-inline-flex">
                  <Typography variant="h5" component="div" gutterBottom sx={{ fontFamily: 'serif' }}>
                    お問い合わせ
                  </Typography>
                  <button type="button" className="btn btn-outline-dark ms-auto" onClick={reset}>
                    リセット
                  </button>
                </div>
                <Box sx={{ mb: 2 }}>
                  <FormControl variant="standard" sx={{ m: 1, minWidth: '100%', minHeight: '8vh' }}>
                    <Typography variant={getVariant()} component="div" gutterBottom sx={{ fontFamily: 'serif' }}>
                      お名前
                    </Typography>
                    <input
                      className="form-control"
                      type="text"
                      id="name"
                      name="user_name"
                      onChange={handleNameChange}
                      value={formik.values.user_name}
                      style={{ fontFamily: 'serif' }}
                      required
                    />
                  </FormControl>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <FormControl variant="standard" sx={{ m: 1, minWidth: '100%', minHeight: '8vh' }}>
                    <Typography variant={getVariant()} component="div" gutterBottom sx={{ fontFamily: 'serif' }}>
                      メールアドレス
                    </Typography>
                    <input
                      type="email"
                      className="form-control"
                      name="user_email"
                      id="email"
                      style={{ fontFamily: 'serif' }}
                      onChange={handleEmailChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.user_email}
                      placeholder="name@example.com"
                      required
                    />
                    {formik.errors.email && formik.touched.email && (
                      <div className="text-danger">{formik.errors.email}</div>
                    )}
                  </FormControl>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <FormControl variant="standard" sx={{ m: 1, minWidth: '100%', minHeight: '8vh' }}>
                    <Typography variant={getVariant()} component="div" gutterBottom sx={{ fontFamily: 'serif' }}>
                      内容
                    </Typography>
                    <textarea
                      className="form-control"
                      id="message"
                      name="message"
                      onChange={handleMessageChange}
                      value={formik.values.message}
                      InputProps={{
                        style: { fontFamily: 'serif' }
                      }}
                      InputLabelProps={{
                        style: { fontFamily: 'serif' }
                      }}

                      required
                    ></textarea>
                  </FormControl>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button type="submit" className="btn btn-outline-dark m-auto" onClick={handleSubmit}>送信する</button>
                </Box>
              </CardContent>
            </Card>
          </Box>
          <input type="hidden" name="redirectTo" value="" />
        </form>
      )}
      <Footer />
    </div>
  );
}
