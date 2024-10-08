import {useConfig} from "./contextHooks/configContext.tsx";
import GameDir from "./GameDir.tsx";
import LoadingSpinner from "./LoadingSpinner.tsx";
import {FormEvent, useState} from "react";
import { getVersion } from '@tauri-apps/api/app';
import {useQuery} from "react-query";

export default function Settings(){
    const config = useConfig();
    const [loading] = useState(false);
    const [username, setUsername] = useState(config?.configQuery.data?.sftpUsername||"")
    const [server, setServer] = useState(config?.configQuery.data?.sftpServer||"")
    const [port, setPort] = useState(config?.configQuery.data?.sftpPort||"")

    const versionQuery = useQuery(["app-version"],async () => {
        return await getVersion()
    })

    const handleSubmit = async (e: FormEvent<HTMLFormElement>)=>{
        console.log(e)
    }
    return(
        <div className={'flex flex-col justify-center items-center h-[80vh] p-20'}>

            <form onSubmit={handleSubmit} className={'grid h-full '}>
                <input type={'text'} name={'sftpUsername'} autoComplete={"username"} value={username} placeholder={"username"} onChange={(e)=>{setUsername(e.currentTarget.value)}}/>
                <input type={'password'} name={'sftpPassword'} autoComplete={"current-password"} placeholder={"password"} />
                <div className={"flex w-full"}>
                    <input type={'text'} name={"sftpServer"} placeholder={"Profile Server"} value={server} onChange={(e)=>{setServer(e.currentTarget.value)}}/>
                    <input type={'text'} name={"sftpPort"} placeholder={"Port"} value={port} onChange={(e)=>{setPort(e.currentTarget.value)}}/>
                </div>
                <GameDir/>
                <button disabled={loading}>
                    {loading?<LoadingSpinner/>:"Save Settings"}
                </button>
            </form>
            <div className={'w-full flex justify-evenly '}>
                <span>
                    App version:
                </span>
                {
                    versionQuery.isLoading?
                        <LoadingSpinner/>
                        :
                        versionQuery.data&&
                            <span>
                                v{versionQuery.data}
                            </span>
                }
            </div>
        </div>
    )
}