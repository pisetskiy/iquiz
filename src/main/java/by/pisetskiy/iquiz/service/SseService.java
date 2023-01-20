package by.pisetskiy.iquiz.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
@RequiredArgsConstructor
public class SseService {

    private final ObjectMapper jsonMapper;

    private static final Map<String, Set<SseEmitter>> EMITTERS = new ConcurrentHashMap<>();
    private static final ExecutorService EXECUTOR_SERVICE = Executors.newCachedThreadPool();

    public synchronized SseEmitter getEventEmitter(String code) {
        Set<SseEmitter> emitters = EMITTERS.computeIfAbsent(code, key -> new HashSet<>());
        SseEmitter emitter = new SseEmitter(0L);
        emitter.onError(e -> {
            e.printStackTrace();
            EMITTERS.getOrDefault(code, Collections.emptySet()).remove(emitter);
        });
        emitter.onCompletion(() -> {
            System.err.println("SseEmitter completed");
            EMITTERS.getOrDefault(code, Collections.emptySet()).remove(emitter);
        });
        emitters.add(emitter);

        return emitter;
    }

    @SneakyThrows
    @Async
    public void sendMessage(String code, String messageType, Object data) {
        ObjectNode message = jsonMapper.createObjectNode();
        message.set("messageType", new TextNode(messageType));
        message.set("data", new TextNode(jsonMapper.writeValueAsString(data)));

        String payload = jsonMapper.writeValueAsString(message);
        Set<SseEmitter> emitters = EMITTERS.getOrDefault(code, Collections.emptySet());
        emitters.forEach(emitter -> {
            EXECUTOR_SERVICE.submit(() -> {
                try {
                    emitter.send(payload);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        });

    }

    @SneakyThrows
    @Async
    public void sendMessage(String code, String messageType, Object data, SseEmitter emitter) {
        ObjectNode message = jsonMapper.createObjectNode();
        message.set("messageType", new TextNode(messageType));
        message.set("data", new TextNode(jsonMapper.writeValueAsString(data)));

        String payload = jsonMapper.writeValueAsString(message);
        EXECUTOR_SERVICE.submit(() -> {
            try {
                emitter.send(payload);
            } catch (Exception e) {
                e.printStackTrace();
            }
        });

    }
}
