"use client"

import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"

export function Effects() {
  return (
    <EffectComposer>
      <Bloom intensity={0.5} luminanceThreshold={0.8} luminanceSmoothing={0.9} blendFunction={BlendFunction.ADD} />
      <Vignette offset={0.3} darkness={0.5} blendFunction={BlendFunction.NORMAL} />
      <ChromaticAberration offset={[0.001, 0.001]} blendFunction={BlendFunction.NORMAL} />
    </EffectComposer>
  )
}
