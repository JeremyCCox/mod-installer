export interface LauncherProfile{
    created?:string,
    game_dir?:string,
    icon?:string,
    last_version_id?:string,
    name?:string,
}
export interface RemoteProfile{
    name:string,
    mods?:[string],
    launcher_profile?:LauncherProfile;
}
export interface InstallerProfile{
    defaultGameDir:string,
    sftpServer?:string,
    sftpPort?:number,
    sftpUsername?:string,
    sftpPassword?:string
}