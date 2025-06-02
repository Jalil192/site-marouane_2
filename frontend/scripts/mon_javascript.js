document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("lightForm");
	const newsletterForm = document.getElementById("newsletterForm");
	const newsletterMessage = document.getElementById("newsletterMessage");
	const statsContainer = document.getElementById("statsContainer");

	const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwCVeSCZzvPENW7LLyyIi1KoEslYo6WzZs93oAvVetSfF8UfumezN4HSACkqyQdw90FgA/exec";

	const icons = {
		persecutes: "🕊️",
		malnutrition: "🍽️",
		pauvrete: "💰",
		education: "📚",
	};

	const colorMap = {
		persecutes: "skyblue",
		malnutrition: "orange",
		pauvrete: "gold",
		education: "purple",
	};

	function renderStats(data) {
		const { causeCount, countryMap } = data;
		let html = `
			<div class="cause-stats">
			<h3 class="mb-3">🌍 Lumières allumées par cause</h3>
			<table class="table table-dark table-striped border-white border rounded">
			<thead><tr><th>Cause</th><th>Participants</th><th>Lumière</th></tr></thead><tbody>`;

	for (const cause in causeCount) {
		html += `
		<tr>
		<td>${icons[cause]} ${capitalize(cause)}</td>
		<td>${causeCount[cause]}</td>
		<td><span class="light-circle" style="--intensity:${causeCount[cause]}; color:${colorMap[cause]}"></span></td>
		</tr>`;
		}

	html += `</tbody></table>
	<h4 class="mt-4">📍 Répartition par pays</h4><ul class="list-unstyled">`;

	for (const country in countryMap) {
		const entries = countryMap[country];
		const text = Object.entries(entries)
		.map(([cause, count]) => `${icons[cause] || ""} ${count}`)
		.join(", ");
		html += `<li><strong>${country}</strong> → ${text}</li>`;
		}

	html += `</ul></div>`;
	statsContainer.innerHTML = html;
	statsContainer.style.display = "block";

	setTimeout(() => {
	statsContainer.style.display = "none";
	}, 120000);
	}

	async function fetchStatsAndRender() {
		try {
			const response = await fetch(SCRIPT_URL + "?action=getStats");
			const data = await response.json();
			renderStats(data);
		} catch (err) {
			console.error("Erreur stats :", err);
		}
		}

	fetchStatsAndRender(); // chargement initial

	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		const data = Object.fromEntries(new FormData(form).entries());

		if (!data.cause || !data.pays) return;

		try {
			const response = await fetch(SCRIPT_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ type: "participation", ...data }),
		});
		if (!response.ok) throw new Error();

		fetchStatsAndRender();
		form.reset();
		} catch (err) {
		console.error("Erreur participation :", err);
		}
		});

	newsletterForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		const email = newsletterForm.newsletterEmail.value.trim();
		if (!email) return;

		try {
			const response = await fetch(SCRIPT_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ type: "newsletter", email }),
		});
		if (!response.ok) throw new Error();

		newsletterMessage.textContent = `Merci ! Ton inscription à UmanitY est bien enregistrée : ${email}`;
		newsletterMessage.classList.remove("d-none");

	setTimeout(() => {
	newsletterMessage.classList.add("d-none");
	}, 5000);

	newsletterForm.reset();
	} catch (err) {
		console.error("Erreur newsletter :", err);
	}
	});

	function capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	document.querySelectorAll(".navbar-nav .nav-link").forEach(link => {
		link.addEventListener("click", () => {
		const navbarCollapse = document.querySelector(".navbar-collapse");
		if (navbarCollapse.classList.contains("show")) {
			new bootstrap.Collapse(navbarCollapse).toggle();
	           }
	        });
	      });
});
		

