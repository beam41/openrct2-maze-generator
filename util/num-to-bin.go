package main

import (
  "fmt"
  "strconv"
  "unsafe"
)
func main() {
  rideFlags := [100]int64{
    -602913097,
    -602913097,
    -602913097,
    -602913097,
    -602913097,
    -738180556,
    -738180553,
    -602913099,
    -1677703099,
    -1676654923,
    -602913097,
    -1810873817,
    -1810611441,
    -1676654921,
    -1811660529,
    -602913097,
    -1676650825,
    -602913097,
    -1811922907,
    -602913097,
    272902156,
    829711,
    -1810626555,
    -1810872777,
    -1810610635,
    67930383,
    68010253,
    68010255,
    9349385,
    0,
    17737993,
    0,
    960777,
    68010248,
    0,
    960777,
    40806664,
    67993865,
    68010248,
    72204552,
    68010255,
    67930376,
    -1676654937,
    -1274789619,
    -602913097,
    960776,
    68010248,
    5095688,
    7252232,
    72204552,
    -1810872665,
    -602913097,
    -602913097,
    -602913097,
    -1676654921,
    -602913097,
    -602913097,
    -602913097,
    -602913097,
    -1676654921,
    -1810872777,
    -1810873817,
    -602913097,
    -738180553,
    -602913097,
    -1676654921,
    -1676654921,
    -1879046137,
    -602913097,
    -1810611441,
    67930379,
    5095688,
    -1810871769,
    -602913097,
    -602909001,
    -1676654937,
    -1676654921,
    68010255,
    -1810874281,
    -1810873801,
    0,
    69058824,
    0,
    0,
    0,
    0,
    -1676654921,
    -602913097,
    -602913097,
    0,
    -602913097,
    -602913097,
    -602913097,
    -1810873817,
    -1676654921,
    -602913097,
    -602913099,
    -602913097,
    1544572453,
    -602913097,
  }

  for _, element := range rideFlags {
    fmt.Println("0b" + strconv.FormatUint(uint64(*(*uint32)(unsafe.Pointer(&element))), 2) + ",")
  }
}
