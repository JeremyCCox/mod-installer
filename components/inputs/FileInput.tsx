import React, {useEffect, useState} from "react";
import {listen} from '@tauri-apps/api/event'


export default function FileInput({fileHandler}:Readonly<{fileHandler:(filePaths:string[])=>void}>){
    const [inputEnabled,setInputEnabled]=useState(false)
    const inputAction=(e:React.DragEvent<HTMLInputElement>)=>{
        console.log(e.currentTarget.files)
    }
    const cleanDrag=(e:any)=>{
        e.preventDefault();
        // e.stopPropagation();
    }
    useEffect(()=>{
        if(inputEnabled){
            const unlisten = listen<string[]>('tauri://file-drop', (event) => {
                fileHandler(event.payload)
            });

            return () => {
                unlisten.then(f => f());
            };
        }
    },[inputEnabled])
    return(
        <>

            {inputEnabled?
                <div className={'fixed z-10 w-full h-screen top-0 right-0 flex justify-evenly items-center  backdrop-blur-md'} onDrop={()=>{console.log("adada")}} onDragOver={cleanDrag} onClick={()=>setInputEnabled(!inputEnabled)}>
                    <label htmlFor={"addmod"} className={'bg-white min-w-[150px] max-w-[600px] border-2 border-black p-8'} onDragOver={cleanDrag} onClick={(e)=>e.stopPropagation()}>
                        Drag & Drop or browse for file!
                        <input type={'file'} id={"addmod"} name={"addmod"} onInput={inputAction} onDragOver={cleanDrag} onClick={(e)=>e.stopPropagation()} />
                    </label>
                </div>
                :
                <button className={'bg-green-300 w-40'} type={'button'} onClick={()=>setInputEnabled(!inputEnabled)}>
                    Add Mod
                </button>
            }

        </>
    )
}