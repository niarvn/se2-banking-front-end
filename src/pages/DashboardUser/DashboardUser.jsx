import "./DashboardUser.css"
import {useHistory} from "react-router-dom";
import AnimatedPage from "../../utils/AnimatedPage";
import React, {useContext, useState} from "react";
import SharedContext from "../../utils/Context";
import {USER_INFO} from "../../const/key_storage";
import {Avatar, Button, Card, Col, Form, Input, Modal, Row, Upload} from "antd";
import {userChangePassword, userGetInfo} from "../../api/api_config";
import ImgCrop from "antd-img-crop";
import {
    BankFilled,
    DollarCircleFilled, InteractionFilled,
    MoneyCollectFilled,
    RedEnvelopeFilled,
    UploadOutlined,
    WalletFilled
} from "@ant-design/icons";
import {URL_ADMIN_DASHBOARD} from "../../const/routing_address";
import {uploadImage} from "../../utils/ImageProcessor";
import Transfer from "../Functions/Transfer/Transfer";
import Deposit from "../Functions/Deposit/Deposit";
import Withdraw from "../Functions/Withdraw/Withdraw";
import Saving from "../Functions/Saving/Saving";
import Loan from "../Functions/Loan/Loan";
import TransactionHistory from "../Functions/TransactionHistory/TransactionHistory";

const DashboardUser = () => {
    const {userInfo, isAdmin, isSessionExpired} = useContext(SharedContext)
    const history = useHistory()
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    const onUploadImage = async (options) => {
        setIsUploadingAvatar(true)
        try {
            await uploadImage(options)
        } catch (TypeError) {
            Modal.error({
                title: "Expired session", onOk: () => {
                    isSessionExpired.set(true)
                },
            })
        } finally {
            userInfo.set((await (await userGetInfo()).json()).data)
            setIsUploadingAvatar(false)
        }

    }

    return (
        <AnimatedPage>
            {isAdmin.get && history.push(URL_ADMIN_DASHBOARD)}
            {!isAdmin.get &&
            <div className="base">
                <Card>
                    <div className="card-container">
                        <div className="card-container__meta">
                            <Avatar size={90}
                                    src={JSON.parse(window.localStorage.getItem(USER_INFO)).user.avatar !== null ? JSON.parse(window.localStorage.getItem(USER_INFO)).user.avatar : "https://joeschmoe.io/api/v1/random"}/>
                            <h2>{JSON.parse(window.localStorage.getItem(USER_INFO)).user.firstName}</h2>
                        </div>
                        <div className="card-container__balance">
                            <h2>Balance: </h2>
                            <p>${JSON.parse(window.localStorage.getItem(USER_INFO)).balance}</p>
                            <h2>Phone number: </h2>
                            <p>{JSON.parse(window.localStorage.getItem(USER_INFO)).phoneNumber}</p>
                        </div>
                        <div className="card-container__btn-list-user">
                            <Button
                                onClick={
                                    () => {
                                        let password = {
                                            previous_pass: "",
                                            new_password: "",
                                            new_password_confirm: "",
                                        }
                                        let isSubmitting = false
                                        Modal.info({
                                            title: "Change account password",
                                            centered: true,
                                            width: 600,
                                            icon: <div/>,
                                            content: (
                                                <Form
                                                    name="basic"
                                                    labelCol={{span: 8}}
                                                    wrapperCol={{span: 16}}
                                                    onFinish={async () => {
                                                        isSubmitting = true
                                                        if (password.new_password !== password.new_password_confirm)
                                                            Modal.error({
                                                                title: "Oops",
                                                                content: "Password doesn't match",
                                                                onOk: () => {
                                                                }
                                                            })
                                                        else {
                                                            let formData = new FormData();
                                                            formData.append('previous_pass', password.previous_pass);
                                                            formData.append('new_password', password.new_password)
                                                            const res = await userChangePassword({
                                                                data: formData,
                                                            })
                                                            if (!res.ok)
                                                                Modal.error({
                                                                    title: "Oops",
                                                                    content: "Previous password doesn't match"
                                                                })
                                                            const json = await res.json()
                                                            if (json.status === 0)
                                                                Modal.success({
                                                                    title: "Change password successfully",
                                                                    onOk: () => Modal.destroyAll()
                                                                })
                                                        }
                                                    }}
                                                    initialValues={{remember: true}}
                                                    autoComplete="on">
                                                    <Form.Item
                                                        label="Previous password:"
                                                        name="prevPass">
                                                        <Input.Password
                                                            onChange={(e) => password.previous_pass = e.currentTarget.value}/>
                                                    </Form.Item>
                                                    <Form.Item
                                                        label="New password:"
                                                        name="newPass">
                                                        <Input.Password
                                                            onChange={(e) => password.new_password = e.currentTarget.value}/>
                                                    </Form.Item>
                                                    <Form.Item
                                                        label="Confirm new password:"
                                                        name="newPassConfirm">
                                                        <Input.Password
                                                            onChange={(e) => password.new_password_confirm = e.currentTarget.value}/>
                                                    </Form.Item>
                                                    <Form.Item wrapperCol={{offset: 8, span: 16}}>
                                                        <div style={{
                                                            display: "flex",
                                                            justifyContent: "flex-start",
                                                            alignItems: "center"
                                                        }}>

                                                            <Button loading={isSubmitting} type="primary"
                                                                    htmlType="submit">
                                                                Submit
                                                            </Button>
                                                            <Button style={{marginLeft: 50}} htmlType="button"
                                                                    onClick={() => Modal.destroyAll()}>
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </Form.Item>
                                                </Form>
                                            ),
                                            okButtonProps: {style: {display: "none"}}
                                        })
                                    }
                                }
                                type={"primary"}>Change password</Button>
                            <ImgCrop rotate shape={"round"} grid quality={100} >
                                <Upload
                                    multiple={false}
                                    showUploadList={false}
                                    customRequest={onUploadImage}>
                                    <Button loading={isUploadingAvatar} type={"primary"} icon={<UploadOutlined/>}>Change
                                        avatar</Button>
                                </Upload>
                            </ImgCrop>
                        </div>
                    </div>
                    <Card style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignContent: "center"
                    }}>
                        <Row className="menu">
                            <Col>
                                <Button className="btn-item" onClick={() => Modal.info({
                                    centered: true,
                                    icon: <div/>,
                                    okButtonProps: {style: {display: "none"}},
                                    closable: true,
                                    content: (<Transfer object={{userInfo: userInfo, isSessionExpired: isSessionExpired}}/>)
                                })}
                                        size={"large"}><DollarCircleFilled/> Transfer</Button>
                            </Col>
                            <Col>
                                <Button className="btn-item" onClick={() => Modal.info({
                                    centered: true,
                                    icon: <div/>,
                                    okButtonProps: {style: {display: "none"}},
                                    closable: true,
                                    content: (<Deposit object={[userInfo, isSessionExpired]}/>)
                                })}
                                        size={"large"}><RedEnvelopeFilled/> Deposit Money</Button>
                            </Col>
                            <Col>
                                <Button className="btn-item" onClick={() => Modal.info({
                                    centered: true,
                                    icon: <div/>,
                                    okButtonProps: {style: {display: "none"}},
                                    closable: true,
                                    content: (<Withdraw object={[userInfo, isSessionExpired]}/>)
                                })}
                                        size={"large"}><MoneyCollectFilled/> Withdraw Money</Button>
                            </Col>
                        </Row>
                        <Row className="menu">
                            <Col>
                                <Button className="btn-item"
                                        onClick={() => Modal.info({
                                            centered: true,
                                            icon: <div/>,
                                            style: {width: "auto"},
                                            width: "auto",
                                            okButtonProps: {style: {display: "none"}},
                                            closable: true,
                                            content: (<Saving object={{userInfo: userInfo, isSessionExpired: isSessionExpired}}/>)
                                        })}size={"large"}><WalletFilled/> Money Saving</Button>

                            </Col>
                            <Col>
                                <Button className="btn-item"
                                        onClick={() => Modal.info({
                                            centered: true,
                                            icon: <div/>,
                                            okButtonProps: {style: {display: "none"}},
                                            closable: true,
                                            width: "auto",
                                            content: (<Loan object={{userInfo: userInfo, isSessionExpired: isSessionExpired}}/>)
                                        })}size={"large"}><BankFilled/> Money Loan</Button>

                            </Col>
                            <Col>
                                <Button className="btn-item" onClick={() => Modal.info({
                                    centered: true,
                                    icon: <div/>,
                                    okButtonProps: {style: {display: "none"}},
                                    closable: true,
                                    width: "auto",
                                    content: (<TransactionHistory object={{isSessionExpired: isSessionExpired}}/>)
                                }) } size={"large"}><InteractionFilled/> Transaction
                                    History</Button>

                            </Col>
                        </Row>
                    </Card>
                </Card>
            </div>
            }
        </AnimatedPage>
    )
}
export default DashboardUser