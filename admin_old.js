async function loadAchievements() {

    const { data, error } =
    await supabaseClient
    .from('achievements')
    .select('*')
    .order('title');

    if(error){
        console.error(error);
        return;
    }

    const container =
    document.getElementById("achievements-list");

    container.innerHTML = "";
    data.forEach(achievement => {

        const card =
        document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <h3>
                ${
                    achievement.unlocked
                    ? '✅'
                    : '🔒'
                }
                ${achievement.title}
            </h3>

            <p>
                ${achievement.description || ""}
            </p>
        `;

        container.appendChild(card);

    });

}

loadAchievements();
