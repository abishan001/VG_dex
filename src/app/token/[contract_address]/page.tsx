import React from 'react'
import { CopyOutlined, QrcodeOutlined } from '@ant-design/icons'

function TokenDetail() {
    return (
        <div className="tokenContainer">
            <div className='tokenHeader' style={{ width: "100%", background: "#ffff", borderTop: "2px solid #5981F3", borderBottom: "2px solid #5981F3" }}>
                <img src='/token.webp' height={40} width={40} className='tokenHeader-item' style={{ borderRadius: "50%" }} />
                <h1 className="tokenHeader-item" style={{ fontWeight: "bold" }}>Address</h1>
                <h2 className="tokenHeader-item">address</h2>
                <CopyOutlined className="tokenHeader-item" />
                <QrcodeOutlined className='tokenHeader-item' />
            </div>
            <div className='aboutToken'>
                <div className='tokenHeader-item' style={{width:"50%" ,border:"1px solid #5981F3", background:"white", borderRadius:'5px'}}>
                    <h1 style={{fontWeight:"bold"}}>Token Details</h1>
                    <h1>Token Name :</h1>
                    <h1>Token Symbol :</h1>
                </div>
                <div className='tokenHeader-item' style={{width:"50%" ,border:"1px solid #5981F3", background:"white", borderRadius:'5px'}}>
                    <h1 style={{fontWeight:"bold"}}>Other Info</h1>
                    <h1>Token Name :</h1>
                    <h1>Token Symbol :</h1>
                </div>
            </div>
        </div>
    )
}

export default TokenDetail