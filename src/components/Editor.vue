<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { loadImage, map } from '../utils.ts';
import { VBtn } from 'vuetify/components';
import { Action } from './logic/action.ts';
import { VCard, VCardText } from 'vuetify/components';
import { VSlider } from 'vuetify/components';
import { ColoredPath, ColoredText, Editor } from './logic/Editor.ts';
import { VColorPicker } from 'vuetify/components';
import { VDialog } from 'vuetify/components';
import { VTextField } from 'vuetify/components';

const currentAction = ref<Action>('painter');
const painterData = ref({
  color: '#000000',
  length: 1,
  isPainting: false,
});
const textData = ref({
  x: 0,
  y: 0,
  isVisible: false,
  font: 1,
  text: '',
});

const editor = ref<Editor | null>(null);
const editorRef = ref<HTMLCanvasElement | null>(null);
const textInputRef = ref<HTMLInputElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  editor.value = new Editor(editorRef.value!);
});

const getClassByAction = (action: Action): 'elevated' | 'outlined' => {
  return currentAction.value == action ? 'outlined' : 'elevated';
};
const changeFile = async (ev: Event) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const e = ev as { target: { files: FileList } };
  const file = e.target.files[0];

  const img = await loadImage(file);

  editor.value?.createBackground(img);
};
const switchAction = (action: Action) => {
  textData.value.isVisible = false;
  currentAction.value = action;
};
const addText = () => {
  if (!editor.value) return;
  if (!editorRef.value) return;

  const [x, y] = editor.value.mapByImage(
    textData.value.x - editorRef.value.offsetLeft,
    textData.value.y - editorRef.value.offsetTop,
  );

  editor.value.add(
    new ColoredText(textData.value.text, textData.value.font, painterData.value.color, x, y),
  );

  textData.value.text = '';
  textData.value.x = 0;
  textData.value.y = 0;
  textData.value.isVisible = false;
};
const mouseDown = (e: MouseEvent) => {
  if (currentAction.value == 'text') {
    if (!editorRef.value) return;

    textData.value.isVisible = true;
    textData.value.x = e.offsetX + editorRef.value.offsetLeft;
    textData.value.y = e.offsetY + editorRef.value.offsetTop;
    return;
  } else if (currentAction.value == 'painter') {
    painterData.value.isPainting = true;
    editor.value?.add(
      new ColoredPath(new Path2D(), painterData.value.color, painterData.value.length),
    );
  } else if (currentAction.value == 'eraser') {
    painterData.value.isPainting = true;
  }
};
const mouseUp = () => {
  painterData.value.isPainting = false;

  editor.value?.endPoint();
};
const mouseMove = (e: MouseEvent) => {
  if (!painterData.value.isPainting) return;
  if (!editorRef.value) return;
  if (!editor.value) return;

  const [x, y] = editor.value.mapByImage(e.offsetX, e.offsetY);

  if (currentAction.value == 'painter') {
    editor.value.addPointToPath(x, y);
  } else {
    if (editor.value?.tryRemoveByPoint(x, y)) {
    }
  }
};
</script>

<template>
  <VCard
    class="editor__text"
    :style="{ left: `${textData.x}px`, top: `${textData.y}px` }"
    ref="textInputRef"
    :class="textData.isVisible ? 'editor__text-active' : ''"
  >
    <VCardText>
      <div class="text-h5">{{ Math.round(textData.font) }}</div>
      <VSlider min="10" max="100" v-model="textData.font" hide-details />
      <VTextField type="text" class="editor__text__input" v-model="textData.text" hide-details />
      <VBtn @click="addText">Добавить</VBtn>
    </VCardText>
  </VCard>
  <div class="editor">
    <VCard>
      <VCardText>
        <div class="editor__panel__actions">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="editor__panel__select"
            @change="changeFile"
          />

          <VBtn icon="mdi-upload" @click="fileInput?.click()"></VBtn>

          <VBtn
            @click="switchAction('eraser')"
            icon="mdi-eraser"
            :variant="getClassByAction('eraser')"
          ></VBtn>

          <VBtn
            :variant="getClassByAction('painter')"
            @click="switchAction('painter')"
            icon="mdi-brush"
          >
          </VBtn>

          <VBtn
            :variant="getClassByAction('text')"
            @click="switchAction('text')"
            icon="mdi-format-title"
          ></VBtn>

          <VBtn @click="() => editor?.removeLast()" icon="mdi-arrow-left"></VBtn>
        </div>
        <div class="editor__panel__modifier">
          <VDialog>
            <template #activator="{ props: activatorProps }">
              <VBtn v-bind="activatorProps" icon="mdi-palette" class="palette"></VBtn>
            </template>

            <template #default>
              <VColorPicker v-model="painterData.color" />
            </template>
          </VDialog>

          <div class="editor__panel__modifier__slider">
            <div class="text-h5">{{ Math.round(painterData.length) }}</div>
            <VSlider type="range" class="w-auto" min="1" max="100" v-model="painterData.length" />
          </div>
        </div>
      </VCardText>
    </VCard>

    <VCard class="editor__container">
      <VCardText class="editor__container__wrapper">
        <canvas
          ref="editorRef"
          class="editor__container__wrapper__canvas"
          @mousemove="mouseMove"
          @mouseup="mouseUp"
          @mousedown="mouseDown"
        ></canvas>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
.palette {
  margin-top: auto;
  margin-bottom: auto;
}
.editor {
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  min-height: 100vh;
  gap: 10px;
  padding: 10px;

  &__text {
    position: absolute;
    display: none;
    flex-direction: column;
    width: 350px;
    z-index: 100;

    &-active {
      display: initial;
    }

    &__input {
      input {
        font-size: 20px;
      }
    }
  }

  &__panel {
    display: flex;
    flex-direction: column;
    gap: 10px;

    &__select {
      display: none;
    }

    &__actions {
      display: flex;
      justify-content: space-between;
    }

    &__modifier {
      display: flex;
      gap: 10px;
      margin-top: 20px;

      &__slider {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
    }
  }

  &__container {
    display: flex;
    flex: 1;
    max-height: 85vh;

    &__wrapper {
      display: flex;

      &__canvas {
        margin: auto;
        max-width: 100%;
        max-height: 100%;
        border: 1px solid black;
      }
    }
  }
}
</style>
