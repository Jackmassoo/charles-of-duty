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
