---
title: "A Beginner’s Guide to Java Native Interface"
slug: "java-native-interface"
date: "2025-12-20"
summary: "Understanding how Java can call native code through JNI and where this bridge is useful."
keywords:
  - Java
  - JNI
  - Native Code
  - JVM
---

Java Native Interface allows Java code running on the JVM to call native applications and libraries written in languages such as C or C++.

```java
public class NativeHello {
  static {
    System.loadLibrary("nativehello");
  }

  private native void sayHello();

  public static void main(String[] args) {
    new NativeHello().sayHello();
  }
}
```

JNI is useful when you need to integrate with platform-specific APIs or reuse existing native libraries.
