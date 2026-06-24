async function addBullets(amount) {

    const { data } =
    await supabaseClient
    .from('game_settings')
    .select('*')
    .single();

    let newValue =
        data.current_bullets + amount;

    if (newValue < 0) {
        newValue = 0;
    }

    await supabaseClient
    .from('game_settings')
    .update({
        current_bullets: newValue
    })
    .eq('id', data.id);

    await supabaseClient
    .from('war_log')
    .insert({
        author: "ADMIN",
        action: amount > 0
            ? "Ajout de billes"
            : "Retrait de billes",
        note: `${amount > 0 ? '+' : ''}${amount} billes`
    });

    alert("Billes mises à jour");

}

async function addTeammate(amount) {

    const { data } =
    await supabaseClient
    .from('game_settings')
    .select('*')
    .single();

    let newValue =
        data.current_teammates + amount;

    if (newValue < 0) {
        newValue = 0;
    }

    await supabaseClient
    .from('game_settings')
    .update({
        current_teammates: newValue
    })
    .eq('id', data.id);

    await supabaseClient
    .from('war_log')
    .insert({
        author: "ADMIN",
        action: amount > 0
            ? "Ajout de coéquipier"
            : "Retrait de coéquipier",
        note: `${amount > 0 ? '+' : ''}${amount} coéquipier`
    });

    alert("Coéquipiers mis à jour");

}
async function setBullets() {

    const value =
        parseInt(
            document.getElementById(
                "bullets-value"
            ).value
        );

    if(isNaN(value)){
        alert("Valeur invalide");
        return;
    }

    const { data } =
    await supabaseClient
    .from('game_settings')
    .select('*')
    .single();

    await supabaseClient
    .from('game_settings')
    .update({
        current_bullets: value
    })
    .eq('id', data.id);

    await supabaseClient
    .from('war_log')
    .insert({
        author: "ADMIN",
        action: "Modification des billes",
        note: `${value} billes`
    });

    alert("Billes mises à jour");

}

async function setTeammates() {

    const value =
        parseInt(
            document.getElementById(
                "teammates-value"
            ).value
        );

    if(isNaN(value)){
        alert("Valeur invalide");
        return;
    }

    const { data } =
    await supabaseClient
    .from('game_settings')
    .select('*')
    .single();

    await supabaseClient
    .from('game_settings')
    .update({
        current_teammates: value
    })
    .eq('id', data.id);

    await supabaseClient
    .from('war_log')
    .insert({
        author: "ADMIN",
        action: "Modification des coéquipiers",
        note: `${value} coéquipiers`
    });

    alert("Coéquipiers mis à jour");

}

async function createBonusMission() {

    const title =
        document.getElementById("bonus-title").value;

    const reward =
        parseInt(
            document.getElementById("bonus-reward").value
        );

    const rewardType =
        document.getElementById("bonus-type").value;

    if(!title || isNaN(reward)){
        alert("Complète tous les champs");
        return;
    }

    const category =
        rewardType === "bullets"
        ? `${reward}_billes`
        : "recrutement";

    const { error } =
    await supabaseClient
    .from('missions')
    .insert({
        title: title,
        category: category,
        reward: reward,
        reward_type: rewardType,
        validated: false,
        is_bonus: true
    });

    if(error){
        console.error(error);
        alert("Erreur création mission");
        return;
    }

    await supabaseClient
    .from('war_log')
    .insert({
        author: "ADMIN",
        action: "Mission bonus créée",
        note: title
    });

    alert("Mission bonus créée");

    location.reload();

}
