<script lang="ts">
	export let players: {
		id: string;
		nickname: string;
		score: number;
	}[] = [];
	export let drawerId: string | null = null;
</script>

<div class="profiles">
	{#each players as p}
		<div class="player {p.id === drawerId ? 'drawer' : ''}">
			<span>{p.nickname}</span>
			<span class="score">Score: {p.score}</span>
			{#if p.id === drawerId}
				<span class="role">(Drawer)</span>
			{/if}
		</div>
	{/each}
</div>