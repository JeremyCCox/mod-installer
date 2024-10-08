import {useQuery, useQueryClient, UseQueryResult} from "react-query";
import {AddonType, ProfileAddon} from "../../lib/types";
import {invoke} from "@tauri-apps/api";
import LoadingSpinner from "../LoadingSpinner";
import AddonRow from "./AddonRow.tsx";
import {useState} from "react";
import FileInput from "../inputs/FileInput";
import {FilePath} from "../profiles/profileMods/ProfileMods.tsx";
import AddonDisplay from "./AddonDisplay.tsx";
import {useLoading} from "../contextHooks/LoadingContext.tsx";

export default function Addons({addonType}:Readonly<{ addonType:AddonType }>){
    const loading = useLoading();
    const [newAddons, setNewAddons] = useState<ProfileAddon[]|undefined>()
    const queryClient = useQueryClient();
    let remoteAddons:UseQueryResult<ProfileAddon[]> = useQuery(["remote-addons",addonType],async () => {
        return await invoke("read_remote_addons",{addonType:addonType})
    })
    const refreshAddons=async () => {
        loading.loadingValues({})
        await invoke("refresh_addons", {addonType})
        await queryClient.refetchQueries(["remote-addons",addonType]);
        loading.setLoading(false)
    }
    const fileHandler=(files:string[])=>{
        let addons:ProfileAddon[] = [];
        for (let file of files){
            let filePath = new FilePath(file)
            let {name,fileName} = filePath.getFileInfo();
            let newAddon ={
                addonType:addonType,
                dependencies: [],
                fileName,
                location: filePath.path,
                name,
                versions: []
            }
            queryClient.setQueryData(["new_addon",newAddon.name],newAddon);

            addons.push(newAddon)
        }
        setNewAddons(addons)
        queryClient.setQueryData(["new_addons",addonType],addons);
    }
    const installNewAddons=async () => {
        await invoke("add_new_profile_addons",{addons:newAddons,addonType})
        await queryClient.refetchQueries(["remote-addons", addonType])
    }
    return(
        <div className={'flex flex-col w-full'}>
            <div className={'flex flex-wrap relative'}>
                <h3 className={'text-center font-bold text-2xl w-full '}>{addonType===AddonType.Mod?"Mods":addonType===AddonType.ResourcePack?"Resource Packs":addonType}</h3>
                <FileInput fileHandler={fileHandler}/>
                <button className={'bg-green-300 w-40 '} type={'button'} onClick={refreshAddons}>                    click me
                </button>
            </div>
            <div>
                {newAddons?.map(addon=>{
                    return(
                        <AddonRow addon={addon} key={addon.name} isNew={true}/>
                    )
                })}
                {newAddons && newAddons.length > 0&&
                    <button onClick={installNewAddons}>
                        Install new mods
                    </button>
                }
            </div>
            {remoteAddons.isLoading?
                    <LoadingSpinner/>
                :
                remoteAddons.data?
                    <div className={'border border-black w-full flex max-h-[60vh] bg-red-500 justify-end lg:flex-row flex-col-reverse'}>
                        <div className={'bg-pink-300 lg:max-w-[350px]  max-w-full overflow-y-auto'}>
                            {remoteAddons.data.map(addon=>{
                                return(
                                    <AddonRow addon={addon} key={addon.name} />
                                )
                            })}
                        </div>
                        <AddonDisplay addonType={addonType}/>
                    </div>
                    :
                    remoteAddons.error?
                        <>Error!</>
                        :
                        <>Something is very wrong</>
            }
        </div>
    )
}
