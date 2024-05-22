const focusTimeData = {
	"What-is-Law-24pt": 361,
	"Law-and-Politics-11t": 587,
	"Functions-of-the-Law-10t": 472,
};

const b1 = {
	summary:
		"I will write a paragraph about what is law. The purpose of law for a nation is to keep the justice, maintain the status quo, preserve human rights, protect minorities, protect social justice and provide orderly social change. In the United States, the legal system is an important component. In most nation-states, those who had political power can make and enforce laws.",
	page_slug: "what-is-law",
	focus_time: {
		"What-is-Law-24pt": 361,
		"Law-and-Politics-11t": 587,
		"Functions-of-the-Law-10t": 472,
	},
};

// copy paste
const b2 = {
	summary:
		"In most nation-states (as countries are called in international law), knowing who has power to make and enforce the laws is a matter of knowing who has political power; in many places, the people or groups that have military power can also command political power to make and enforce the laws. Revolutions are difficult and contentious, but each year there are revolts against existing political-legal authority; an aspiration for democratic rule, or greater “rights” for citizens, is a recurring theme in politics and law.",
	page_slug: "what-is-law",
	focus_time: focusTimeData,
};

const b3 = {
	page_slug: "the-pretrial-and-trial-phase",
	summary:
		"In this segment, I learned about the civil law system in the United States and how it differentiates from country to country. I learned what the civil law system actually is and how it operates in the United States versus other countries in the world. This segment gave some history on civil law and mentioned different types of laws like common law and criminal law ",
};

const main = async () => {
	const response = await fetch("/api/itell/score/stairs", {
		method: "POST",
		body: JSON.stringify(b1),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.ok && response.body) {
		const reader = response.body.getReader();
		const decoder = new TextDecoder();
		let done = false;
		let chunkIndex = 0;

		while (!done) {
			const { value, done: doneReading } = await reader.read();
			done = doneReading;
			const chunk = decoder.decode(value);

			if (chunkIndex === 0) {
				console.log("### SummaryResults");
				console.log(chunk);
				console.log("### SummaryResults end\n");
			} else {
				console.log("### chunk");
				console.log(chunk);
				console.log("### last chunk end\n");
			}

			chunkIndex++;
		}
	}
};

main();
