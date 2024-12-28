export class StreamAPI {
  private writer: WritableStreamDefaultWriter<Uint8Array>;
  private encoder: TextEncoder;
  private writable: WritableStream;
  private aborters: (() => void | Promise<void>)[] = [];
  readable: ReadableStream;

  aborted: boolean = false;
  closed: boolean = false;

  constructor(writable: WritableStream, readable: ReadableStream) {
    this.writable = writable;
    this.writer = writable.getWriter();
    this.encoder = new TextEncoder();

    const reader = readable.getReader();

    this.aborters.push(async () => {
      await reader.cancel();
    });

    this.readable = new ReadableStream({
      async pull(controller) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
        } else {
          controller.enqueue(value);
        }
      },
      cancel: () => {
        this.abort();
      },
    });
  }

  async write(data: Uint8Array | string): Promise<StreamAPI> {
    if (typeof data === "string") {
      data = this.encoder.encode(data);
    }
    await this.writer.write(data);

    return this;
  }

  async writeln(data: string): Promise<StreamAPI> {
    await this.write(data + "\n");
    return this;
  }

  async pipe(rs: ReadableStream): Promise<void> {
    this.writer.releaseLock();
    await rs.pipeTo(this.writable, { preventClose: true });
    this.writer = this.writable.getWriter();
  }

  async close(): Promise<void> {
    await this.writer.close();
    this.closed = true;
  }

  sleep(ms: number): Promise<unknown> {
    return new Promise((res) => setTimeout(res, ms));
  }

  onAbort(cb: () => void | Promise<void>): void {
    this.aborters.push(cb);
  }

  abort(): void {
    if (!this.aborted) {
      this.aborted = true;
      this.aborters.forEach((aborter) => aborter());
    }
  }
}
