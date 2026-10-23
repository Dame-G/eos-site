<script setup lang="ts">
import { EAvatarGroup, EInline, EStack, EText } from "@eos-ui/vue";

const team = [{ name: "Ada Lovelace" }, { name: "Grace Hopper" }, { name: "Mary Ann Evans" }, { name: "Alan Turing" }, { name: "Dr. Priya Shah" }, { name: "Jo Park" }];
</script>

<template>
  <EStack>
    <EInline>
      <EAvatarGroup :items="team" label="Care team" />
      <EText>Six people, four shown</EText>
    </EInline>
    <EInline>
      <EAvatarGroup :items="team.slice(0, 3)" size="sm" />
      <EAvatarGroup :items="team.slice(0, 3)" />
      <EAvatarGroup :items="team.slice(0, 3)" size="lg" />
    </EInline>
    <EAvatarGroup :items="team" :max="2" label="Reviewers" />
  </EStack>
</template>
