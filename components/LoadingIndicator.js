"use client";

import React from "react";
import { ActivityIndicator, Surface } from "react-native-paper";

export const LoadingIndicator = () => (
  <Surface
    mode="flat"
    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
  >
    <ActivityIndicator size="large" animating={true} />
  </Surface>
);
