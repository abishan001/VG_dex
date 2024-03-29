'use client'
import React, { useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
const options = ["REact", "Vre"]

function Send() {
  const [isActive, setIsActive] = useState(false);
  const [selected, setSelected] = useState("")
  return (
    <div className='buyContainer'>
      <div className='buyInput' style={{paddingTop:"20px"}}>
        <input placeholder='Wallet Address' type='text' style={{ borderRadius: "10px", paddingLeft: "10px", color: "black", fontWeight: "bold", outline: "none" }}></input>
        <div className='dropdown'>
          <div className='dropdown-btn' onClick={(e) => setIsActive(!isActive)}>
            {selected || "Choose Token"}
            <DownOutlined />
          </div>
          {isActive && (
            <div className='dropdown-content'>
              {options.map((opt) => (
                <div className='dropdown-item' onClick={(e) => {
                  setSelected(opt);
                  setIsActive(false);
                }}>
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <button className='buyButton' disabled={false} onClick={() => { }}>Send Token</button>
    </div>
  )
}

export default Send