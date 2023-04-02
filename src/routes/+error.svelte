<script>
	import { page } from '$app/stores';
</script>

<div class="container">
	<article>
		<h1>{$page.status}: {$page.error.message}</h1>
		<p>Unfortunately something went wrong.</p>
	</article>
</div>
