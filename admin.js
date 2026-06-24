// ======================================
// CHARLES OF DUTY
// ADMIN V1.0
// Partie 1/4
// ======================================

let currentMissionId = null;

// ======================================
// INITIALISATION
// ======================================

async function initAdmin(){

    await loadDashboard();

    await loadMissionEditor();

    await loadBonusMissions();

    await loadValidatedMissions();

}

document.addEventListener(
    "DOMContentLoaded",
    initAdmin
);

// ======================================
// DASHBOARD
// ======================================

async function loadDashboard(){

    const { data: settings } =
    await supabaseClient
    .from("game_settings")
    .select("*")
    .single();

    const { count: missionsDone } =
    await supabaseClient
    .from("missions")
    .select("*", {
        count:"exact",
        head:true
    })
    .eq("validated", true);

    const { count: achievements } =
    await supabaseClient
    .from("achievements")
    .select("*", {
        count:"exact",
        head:true
    })
    .eq("unlocked", true);

    document.getElementById(
        "admin-bullets"
    ).textContent =
        settings.current_bullets;

    document.getElementById(
        "admin-team"
    ).textContent =
        settings.current_teammates;

    document.getElementById(
        "admin-missions"
    ).textContent =
        missionsDone + " / 43";

    document.getElementById(
        "admin-achievements"
    ).textContent =
        achievements;

    document.getElementById(
        "bullets-value"
    ).value =
        settings.current_bullets;

    document.getElementById(
        "teammates-value"
    ).value =
        settings.current_teammates;

}

// ======================================
// OUTILS
// ======================================

async function logAdmin(
    action,
    note
){

    await supabaseClient
    .from("war_log")
    .insert({

        author:"ADMIN",

        action:action,

        note:note

    });

}

function refresh(){

    loadDashboard();

    loadMissionEditor();

    loadBonusMissions();

    loadValidatedMissions();

}
// ======================================
// GESTION DU MARIÉ
// Partie 2/4
// ======================================

async function addBullets(amount){

    const { data } =
    await supabaseClient
    .from("game_settings")
    .select("*")
    .single();

    let bullets =
        data.current_bullets + amount;

    if(bullets < 0){
        bullets = 0;
    }

    await supabaseClient
    .from("game_settings")
    .update({
        current_bullets: bullets
    })
    .eq("id", data.id);

    await logAdmin(
        amount > 0
            ? "Ajout de billes"
            : "Retrait de billes",
        `${amount > 0 ? "+" : ""}${amount} billes`
    );

    await loadDashboard();

}

async function setBullets(){

    const value =
        parseInt(
            document.getElementById(
                "bullets-value"
            ).value
        );

    if(isNaN(value)) return;

    const { data } =
    await supabaseClient
    .from("game_settings")
    .select("*")
    .single();

    await supabaseClient
    .from("game_settings")
    .update({
        current_bullets:value
    })
    .eq("id", data.id);

    await logAdmin(
        "Modification des billes",
        value + " billes"
    );

    await loadDashboard();

}

async function addTeammate(amount){

    const { data } =
    await supabaseClient
    .from("game_settings")
    .select("*")
    .single();

    let teammates =
        data.current_teammates + amount;

    if(teammates < 0){
        teammates = 0;
    }

    await supabaseClient
    .from("game_settings")
    .update({
        current_teammates: teammates
    })
    .eq("id", data.id);

    await logAdmin(
        amount > 0
            ? "Ajout de coéquipier"
            : "Retrait de coéquipier",
        `${amount > 0 ? "+" : ""}${amount} coéquipier`
    );

    await loadDashboard();

}

async function setTeammates(){

    const value =
        parseInt(
            document.getElementById(
                "teammates-value"
            ).value
        );

    if(isNaN(value)) return;

    const { data } =
    await supabaseClient
    .from("game_settings")
    .select("*")
    .single();

    await supabaseClient
    .from("game_settings")
    .update({
        current_teammates:value
    })
    .eq("id", data.id);

    await logAdmin(
        "Modification des coéquipiers",
        value + " coéquipiers"
    );

    await loadDashboard();

}
// ======================================
// GESTION DES MISSIONS
// Partie 3/4
// ======================================

async function createBonusMission(){

    const title =
        document.getElementById("bonus-title").value;

    const reward =
        parseInt(
            document.getElementById("bonus-reward").value
        );

    const rewardType =
        document.getElementById("bonus-type").value;

    if(!title || isNaN(reward)) return;

    const category =
        rewardType === "bullets"
            ? reward + "_billes"
            : "recrutement";

    await supabaseClient
    .from("missions")
    .insert({
        title,
        reward,
        reward_type: rewardType,
        category,
        validated:false,
        is_bonus:true
    });

    await logAdmin(
        "Mission bonus créée",
        title
    );

    refresh();

}

async function loadMissionEditor(){

    const { data } =
    await supabaseClient
    .from("missions")
    .select("*")
    .order("title");

    const select =
        document.getElementById(
            "edit-mission-select"
        );

    select.innerHTML = "";

    data.forEach(mission=>{

        const option =
            document.createElement("option");

        option.value =
            mission.id;

        option.textContent =
            mission.title;

        select.appendChild(option);

    });

    if(data.length){

        loadMission(data[0].id);

    }

    select.onchange = ()=>
        loadMission(select.value);

}

async function loadMission(id){

    const { data } =
    await supabaseClient
    .from("missions")
    .select("*")
    .eq("id", id)
    .single();

    currentMissionId = id;

    document.getElementById(
        "edit-title"
    ).value = data.title;

    document.getElementById(
        "edit-reward"
    ).value = data.reward;

    document.getElementById(
        "edit-type"
    ).value = data.reward_type;

}

async function saveMission(){

    const title =
        document.getElementById(
            "edit-title"
        ).value;

    const reward =
        parseInt(
            document.getElementById(
                "edit-reward"
            ).value
        );

    const rewardType =
        document.getElementById(
            "edit-type"
        ).value;

    const category =
        rewardType === "bullets"
            ? reward + "_billes"
            : "recrutement";

    await supabaseClient
    .from("missions")
    .update({

        title,

        reward,

        reward_type: rewardType,

        category

    })
    .eq("id", currentMissionId);

    await logAdmin(
        "Mission modifiée",
        title
    );

    refresh();

}
