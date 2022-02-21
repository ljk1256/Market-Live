import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import MessageSideBar from './MessageSideBar';
import { Form, Button } from "react-bootstrap";

function MessageWrite() {
    
    const navigate = useNavigate();

    const [receiverId, setReceiverId] = useState('')
    const [senderId, setSenderId] = useState('')
    const [checkNickname, setCheckNickname] = useState(false)
    const [nicknameMsg, setNicknameMsg] = useState('')

    // 내용 저장
    const [inputs, setInputs] = useState({
        to: '',
        title: '',
        content: '',
    });
    const { to, title, content } = inputs; 
    const onChange = (e) => {
        const { value, name } = e.target;
        setInputs({
            ...inputs, 
            [name]: value 
        });
    };


    // 보내는 사람 pk 저장
    useEffect(() => {
        axios({
            method: 'get',
            url: '/user/mypage/',
            headers: {Authorization: localStorage.getItem('jwt')}
        })
        .then(res => { 
            console.log(res)
            setSenderId(res.data.userid)
        })
        .catch(err => {
            console.log(err)
            // 토큰 만료되면 로그아웃
            localStorage.removeItem("jwt");
            navigate("/login");
        })
    }, [])


    // 받는 사람 닉네임 체크 후 pk 저장
    useEffect(() => {
        setCheckNickname(false)
        setNicknameMsg('')
        const debounce = setTimeout(() => {
            if (to.length >= 1){
                axios({
                    method: 'get',
                    url: '/user/search?nickname='+to,
                })
                .then(res => {
                    console.log(res)
                    setCheckNickname(true)
                    setNicknameMsg('')
                    setReceiverId(res.data.userId)
                })
                .catch(err => {
                    setNicknameMsg('닉네임이 없습니다.')
                })
            }
        }, 700)
            return() => clearTimeout(debounce)
        }, [to])


    // 보내기 버튼 누를시
    const onSend = ()  => {
        if (checkNickname) {
            if (title.trim() === '' || content.trim() === ''){
                alert('제목과 내용을 입력해주세요.')
            }
            else{
            axios({     // 쪽지 보내기
                method: 'post',
                url: '/dm/create',
                data: {
                    "receiverId": receiverId,
                    "senderId": senderId,
                    "dm_title": title,
                    "dm_msg": content,
                }
            })
            .then(res => {
                console.log(res)
                navigate('/message')
            })
            .catch(err => {
                console.log(err)
            })
            }
        }
        else{
            alert('닉네임을 확인해주세요.')
        }
    }

    return(
        <div className="d-md-flex">
            <MessageSideBar></MessageSideBar>
            {/* <div className="mt-3 ms-3 border border-dark p-3">
                <div className="mb-2">
                    받는 사람: 
                    <input name="to"
                    type="text" 
                    onChange={onChange}
                    value={to}
                    maxLength="15"
                    />
                    {nicknameMsg}
                </div>
                <div className="mb-2">
                    제목: 
                    <input name="title"
                    type="text" 
                    onChange={onChange}
                    value={title}
                    maxLength="30"
                    />
                </div>
                <div>
                    <textarea name="content" 
                    id="" cols="30" rows="10"
                    onChange={onChange}
                    value={content}
                    maxLength="100"
                    ></textarea>
                </div>
                <div className="">
                    <button onClick={onSend}>보내기</button>
                </div>
            </div> */}
            <Form style={{ width: '90%', maxWidth:"600px" }} className="mx-auto border p-2 mt-3 mt-md-5">
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>받는 사람</Form.Label>
                    <Form.Control 
                        maxLength={15} 
                        type="text" 
                        placeholder="닉네임을 입력해주세요." 
                        name="to"
                        onChange={onChange}
                        value={to}
                    />
                    {nicknameMsg}
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>제목</Form.Label>
                    <Form.Control 
                        maxLength={30} 
                        type="text" 
                        name="title"
                        onChange={onChange}
                        value={title}
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>내용</Form.Label>
                    <Form.Control 
                        maxLength={300} 
                        as="textarea" 
                        rows={5} 
                        name="content"
                        onChange={onChange}
                        value={content}
                    />
                </Form.Group>
                <Button 
                    // variant="secondary"
                    variant="outline-secondary"
                    onClick={onSend}
                    className="d-flex ms-auto"
                >보내기</Button>
            </Form>
            <div className="ms-auto d-none d-md-block"></div>
        </div>
    )
}

export default MessageWrite;