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
