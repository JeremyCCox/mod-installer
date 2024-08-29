import {invoke} from "@tauri-apps/api";
import {useSearchParams} from "react-router-dom";
import {useQueryClient} from "react-query";

export default function ResourcePack({pack,installed}:Readonly<{pack:any,installed:boolean}>){
    let [searchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const installPack=async ()=>{
        await invoke("install_resource_pack", {profileName:searchParams.get("profile"),packName:pack.name})
        await queryClient.refetchQueries(["local-profiles",searchParams.get("profile")])
    }
    const deletePack=async ()=>{
        await invoke("remove_local_resource_pack", {profileName:searchParams.get("profile"),packName:pack.name})
        await queryClient.refetchQueries(["local-profiles",searchParams.get("profile")])
    }

    if(installed){
        return(
            <div className={'text-green-500 flex '}>
                <p>
                    {pack.name}
                </p>
                <button onClick={deletePack}>Delete</button>
            </div>
        )
    }else{
        return(
            <div className={'text-red-500 flex '}>
                <p>
                    {pack.name}
                </p>
                <button onClick={installPack}>Install</button>
            </div>
        )
    }
}