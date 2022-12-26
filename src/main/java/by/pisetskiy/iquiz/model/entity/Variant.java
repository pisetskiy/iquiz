package by.pisetskiy.iquiz.model.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
@SuperBuilder
public class Variant extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Question question;
    @Column(nullable = false)
    private String content;
    @Builder.Default
    private Boolean isTrue = Boolean.FALSE;
    @Column(columnDefinition = "TIMESTAMP", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime updatedAt;
}
